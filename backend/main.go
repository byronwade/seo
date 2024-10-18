package main

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"strings"
	"sync"
	"time"

	"github.com/PuerkitoBio/goquery"
)

const (
	maxDepth            = 3
	maxConcurrentCrawls = 10
	crawlTimeout        = 30 * time.Second
)

type Backlink struct {
	SourceURL string
	TargetURL string
}

var (
	targetDomain     = "wadesplumbingandseptic.com"
	visitedURLs      = make(map[string]bool)
	backlinks        = make(map[string]Backlink)
	visitedURLsMutex sync.Mutex
	backlinksMutex   sync.Mutex
	semaphore        = make(chan struct{}, maxConcurrentCrawls)
	wg               sync.WaitGroup
)

func main() {
	startURLs := []string{
		"https://www.yelp.com",
		"https://www.yellowpages.com",
		"https://www.bbb.org",
		"https://www.mapquest.com",
		"https://www.angi.com",
	}

	for _, startURL := range startURLs {
		wg.Add(1)
		go crawl(startURL, 0)
	}

	wg.Wait()

	fmt.Printf("\nFound %d potential backlinks for %s:\n\n", len(backlinks), targetDomain)
	for _, backlink := range backlinks {
		fmt.Printf("Source: %s\nTarget: %s\n\n", backlink.SourceURL, backlink.TargetURL)
	}
}

func crawl(urlString string, depth int) {
	defer wg.Done()

	if depth >= maxDepth {
		return
	}

	semaphore <- struct{}{} // Acquire semaphore
	defer func() { <-semaphore }() // Release semaphore

	visitedURLsMutex.Lock()
	if visitedURLs[urlString] {
		visitedURLsMutex.Unlock()
		return
	}
	visitedURLs[urlString] = true
	visitedURLsMutex.Unlock()

	urlString = ensureScheme(urlString)

	log.Printf("Visiting %s", urlString)

	client := &http.Client{
		Timeout: crawlTimeout,
	}
	req, err := http.NewRequest("GET", urlString, nil)
	if err != nil {
		log.Printf("Error creating request for %s: %v", urlString, err)
		return
	}

	req.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")

	resp, err := client.Do(req)
	if err != nil {
		log.Printf("Error fetching %s: %v", urlString, err)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		log.Printf("Received non-200 status code for %s: %d", urlString, resp.StatusCode)
		return
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Printf("Error reading body from %s: %v", urlString, err)
		return
	}

	doc, err := goquery.NewDocumentFromReader(strings.NewReader(string(body)))
	if err != nil {
		log.Printf("Error parsing HTML for %s: %v", urlString, err)
		return
	}

	pageContent := doc.Find("body").Text()
	isRelevant := strings.Contains(strings.ToLower(pageContent), "plumbing") || 
				  strings.Contains(strings.ToLower(pageContent), "septic")

	doc.Find("a").Each(func(i int, s *goquery.Selection) {
		link, exists := s.Attr("href")
		if !exists {
			return
		}

		absoluteURL := makeAbsoluteURL(urlString, link)
		if absoluteURL == "" {
			return
		}

		if strings.Contains(absoluteURL, targetDomain) {
			backlinksMutex.Lock()
			backlinks[absoluteURL] = Backlink{SourceURL: urlString, TargetURL: absoluteURL}
			backlinksMutex.Unlock()
			log.Printf("Found backlink: %s -> %s", urlString, absoluteURL)
		} else if isRelevant {
			wg.Add(1)
			go crawl(absoluteURL, depth+1)
		}
	})
}

func ensureScheme(urlString string) string {
	if !strings.HasPrefix(urlString, "http://") && !strings.HasPrefix(urlString, "https://") {
		return "https://" + urlString
	}
	return urlString
}

func makeAbsoluteURL(base, href string) string {
	baseURL, err := url.Parse(base)
	if err != nil {
		return ""
	}
	relativeURL, err := url.Parse(href)
	if err != nil {
		return ""
	}
	absoluteURL := baseURL.ResolveReference(relativeURL)
	return absoluteURL.String()
}
