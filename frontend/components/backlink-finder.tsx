"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { AlertCircle, ArrowUpRight, Download, Link, Mail, Share2, ExternalLink, ThumbsUp, ThumbsDown, DollarSign, Target } from 'lucide-react'

// Mock function to simulate fetching potential link opportunities
const fetchPotentialLinkOpportunities = async (domain: string, industry: string) => {
  await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API delay
  return {
    potentialOpportunities: Array.from({ length: 20 }, (_, i) => ({
      url: `https://potential${i + 1}.com`,
      domainAuthority: Math.floor(Math.random() * 100),
      relevance: Math.floor(Math.random() * 100),
      trafficEstimate: Math.floor(Math.random() * 1000000),
      linkType: ['Guest Post', 'Resource Page', 'Sponsored Content', 'Directory Listing'][Math.floor(Math.random() * 4)],
      contactEmail: `contact@potential${i + 1}.com`,
      estimatedCost: Math.random() > 0.5 ? Math.floor(Math.random() * 500) : 0,
      outreachDifficulty: Math.floor(Math.random() * 5) + 1,
    })),
    industryBreakdown: [
      { name: 'Technology', value: 30 },
      { name: 'Marketing', value: 25 },
      { name: 'Finance', value: 20 },
      { name: 'Health', value: 15 },
      { name: 'Education', value: 10 },
    ],
    topKeywords: Array.from({ length: 10 }, (_, i) => ({
      keyword: `Keyword ${i + 1}`,
      searchVolume: Math.floor(Math.random() * 10000),
      difficulty: Math.floor(Math.random() * 100),
    })),
    contentIdeas: Array.from({ length: 5 }, (_, i) => ({
      title: `Content Idea ${i + 1}`,
      type: ['Blog Post', 'Infographic', 'Video', 'Whitepaper', 'Case Study'][Math.floor(Math.random() * 5)],
      potentialLinks: Math.floor(Math.random() * 50) + 10,
    })),
    outreachTemplates: [
      { name: 'Guest Post Pitch', subject: 'Collaboration Opportunity: Guest Post on [Your Topic]' },
      { name: 'Resource Page Addition', subject: 'Valuable Resource for Your [Topic] Page' },
      { name: 'Broken Link Building', subject: 'Improving Your [Topic] Resources Page' },
    ],
  }
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export function BacklinkFinder() {
  const [domain, setDomain] = useState('')
  const [industry, setIndustry] = useState('')
  const [linkOpportunities, setLinkOpportunities] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('opportunities')
  const [minDomainAuthority, setMinDomainAuthority] = useState(0)
  const [minRelevance, setMinRelevance] = useState(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await fetchPotentialLinkOpportunities(domain, industry)
      setLinkOpportunities(data)
    } catch (error) {
      console.error('Error fetching potential link opportunities:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredOpportunities = linkOpportunities?.potentialOpportunities.filter(opp => 
    opp.domainAuthority >= minDomainAuthority && opp.relevance >= minRelevance
  ) || []

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6">Potential Backlink Finder</h1>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <Input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="Enter your domain (e.g., example.com)"
            className="flex-grow"
          />
          <Select value={industry} onValueChange={setIndustry}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="health">Health</SelectItem>
              <SelectItem value="education">Education</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" disabled={loading}>
            {loading ? 'Searching...' : 'Find Opportunities'}
          </Button>
        </div>
      </form>

      {linkOpportunities && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="opportunities">Potential Link Opportunities</TabsTrigger>
            <TabsTrigger value="keywords">Target Keywords</TabsTrigger>
            <TabsTrigger value="content">Content Ideas</TabsTrigger>
            <TabsTrigger value="outreach">Outreach Strategies</TabsTrigger>
          </TabsList>

          <TabsContent value="opportunities">
            <Card>
              <CardHeader>
                <CardTitle>Top Potential Link Opportunities</CardTitle>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span>Min Domain Authority:</span>
                    <Slider
                      value={[minDomainAuthority]}
                      onValueChange={(value) => setMinDomainAuthority(value[0])}
                      max={100}
                      step={1}
                      className="w-[200px]"
                    />
                    <span>{minDomainAuthority}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>Min Relevance:</span>
                    <Slider
                      value={[minRelevance]}
                      onValueChange={(value) => setMinRelevance(value[0])}
                      max={100}
                      step={1}
                      className="w-[200px]"
                    />
                    <span>{minRelevance}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Website</TableHead>
                      <TableHead>Domain Authority</TableHead>
                      <TableHead>Relevance</TableHead>
                      <TableHead>Traffic Estimate</TableHead>
                      <TableHead>Link Type</TableHead>
                      <TableHead>Outreach Difficulty</TableHead>
                      <TableHead>Estimated Cost</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOpportunities.map((opp, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <a href={opp.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center">
                            {opp.url.substring(8, 30)}...
                            <ExternalLink className="ml-1 h-4 w-4" />
                          </a>
                        </TableCell>
                        <TableCell>{opp.domainAuthority}</TableCell>
                        <TableCell>{opp.relevance}</TableCell>
                        <TableCell>{opp.trafficEstimate.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{opp.linkType}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Progress value={opp.outreachDifficulty * 20} className="w-[60px] mr-2" />
                            {opp.outreachDifficulty}/5
                          </div>
                        </TableCell>
                        <TableCell>{opp.estimatedCost > 0 ? `$${opp.estimatedCost}` : 'Free'}</TableCell>
                        <TableCell>
                          <Button size="sm">
                            <Target className="mr-2 h-4 w-4" />
                            Target
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Industry Breakdown of Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={linkOpportunities.industryBreakdown}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      label
                    >
                      {linkOpportunities.industryBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="keywords">
            <Card>
              <CardHeader>
                <CardTitle>Top Target Keywords for Link Building</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Keyword</TableHead>
                      <TableHead>Search Volume</TableHead>
                      <TableHead>Difficulty</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {linkOpportunities.topKeywords.map((keyword, index) => (
                      <TableRow key={index}>
                        <TableCell>{keyword.keyword}</TableCell>
                        <TableCell>{keyword.searchVolume.toLocaleString()}</TableCell>
                        <TableCell>
                          <Progress value={keyword.difficulty} className="w-[60px]" />
                        </TableCell>
                        <TableCell>
                          <Button size="sm">
                            <Target className="mr-2 h-4 w-4" />
                            Target
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle>Content Ideas for Link Building</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Content Idea</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Potential Links</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {linkOpportunities.contentIdeas.map((idea, index) => (
                      <TableRow key={index}>
                        <TableCell>{idea.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{idea.type}</Badge>
                        </TableCell>
                        <TableCell>{idea.potentialLinks}</TableCell>
                        <TableCell>
                          <Button size="sm">
                            <Link className="mr-2 h-4 w-4" />
                            Create
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="outreach">
            <Card>
              <CardHeader>
                <CardTitle>Outreach Strategies and Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Strategy</TableHead>
                      <TableHead>Subject Line</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {linkOpportunities.outreachTemplates.map((template, index) => (
                      <TableRow key={index}>
                        <TableCell>{template.name}</TableCell>
                        <TableCell>{template.subject}</TableCell>
                        <TableCell>
                          <Button size="sm">
                            <Mail className="mr-2 h-4 w-4" />
                            Use Template
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {linkOpportunities && (
        <div className="mt-8">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>AI-Powered Link Building Strategy</AlertTitle>
            <AlertDescription>
              Based on your industry and target keywords, we recommend  focusing on creating high-quality, data-driven content in the form of infographics and case studies. These content types have shown the highest potential for attracting backlinks in your niche. Consider reaching out to the top 5 websites in your opportunities list, as they have high relevance and domain authority scores. Personalized outreach using the "Resource Page Addition" template has shown the best results for similar websites in your industry.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {linkOpportunities && (
        <div className="mt-8 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Export Opportunities
            </Button>
            <Button variant="outline">
              <Share2 className="mr-2 h-4 w-4" />
              Share Report
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Auto-refresh opportunities</span>
            <Switch />
          </div>
        </div>
      )}
    </div>
  )
}