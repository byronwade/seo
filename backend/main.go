package main

import (
    "fmt"
    "github.com/gocolly/colly/v2"
)

func main() {
    // Create a new collector (the main component of Colly)
    c := colly.NewCollector()

    // OnHTML callback is triggered when a specified HTML element is found
    c.OnHTML("title", func(e *colly.HTMLElement) {
        fmt.Println("Page title:", e.Text)
    })

    // OnRequest is triggered when a request is about to be made
    c.OnRequest(func(r *colly.Request) {
        fmt.Println("Visiting", r.URL.String())
    })

    // Start scraping a webpage
    c.Visit("http://example.com")
}
