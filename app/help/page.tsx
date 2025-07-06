import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HelpCircle, Mail, MessageCircle, Phone, Search, Shield, Heart } from "lucide-react"
import Navigation from "@/components/navigation"
import Link from "next/link"

export default function HelpPage() {
  const faqs = [
    {
      question: "How do I change the text size?",
      answer:
        "Go to Settings and look for 'Text Size' under Visual Settings. You can use the slider to make text bigger or smaller. The changes will save automatically.",
    },
    {
      question: "What if I feel overwhelmed while using the website?",
      answer:
        "Take a break anytime you need to. You can also go to Settings and turn on 'Reduce Motion' to make the website calmer. The Calming Sounds tool can also help you relax.",
    },
    {
      question: "How do I book an appointment?",
      answer:
        "Click on 'Schedule Appointments' from the main menu. You'll see available times and can choose what works best for you. You'll get a confirmation email after booking.",
    },
    {
      question: "Can I use this website on my phone?",
      answer:
        "Yes! The website works on phones, tablets, and computers. All the features work the same way on every device.",
    },
    {
      question: "What if I need help right away?",
      answer:
        "For urgent help, call the crisis helpline at 988. For website help, use the chat button below or send us an email. We usually respond within 24 hours.",
    },
    {
      question: "How do I save my favorite tools?",
      answer:
        "When you use a tool you like, click the heart icon to save it. You can find all your saved tools in your personal dashboard.",
    },
    {
      question: "Is my information private?",
      answer:
        "Yes, your information is completely private. We never share your personal details with anyone. You can read our full privacy policy for more details.",
    },
    {
      question: "What if I can't find what I'm looking for?",
      answer:
        "Try using the search bar at the top of any page. You can also contact us using the form below, and we'll help you find what you need.",
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-medium text-slate-800 mb-4">Help & Support</h1>
          <p className="text-slate-600 leading-relaxed max-w-2xl mx-auto">
            We're here to help you use this website comfortably. Find answers to common questions or contact us
            directly.
          </p>
        </div>

        {/* Search Help */}
        <Card className="border-2 border-slate-200 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-slate-800">
              <Search className="h-5 w-5" />
              Search for Help
            </CardTitle>
            <CardDescription>Type what you need help with</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search help topics..."
                className="pl-10 border-2 border-slate-200 focus:border-blue-300"
                aria-label="Search help topics"
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Help Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-2 border-slate-200 hover:shadow-md transition-shadow duration-200">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Phone className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-base font-medium text-slate-800">Crisis Support</CardTitle>
              <CardDescription className="text-sm">Need help right now?</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild className="w-full bg-red-600 hover:bg-red-700 text-white">
                <Link href="tel:988">Call 988</Link>
              </Button>
              <p className="text-xs text-slate-500 mt-2">24/7 crisis helpline</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-slate-200 hover:shadow-md transition-shadow duration-200">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <MessageCircle className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-base font-medium text-slate-800">Live Chat</CardTitle>
              <CardDescription className="text-sm">Chat with our support team</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Start Chat</Button>
              <p className="text-xs text-slate-500 mt-2">Usually responds in 5 minutes</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-slate-200 hover:shadow-md transition-shadow duration-200">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-base font-medium text-slate-800">Email Support</CardTitle>
              <CardDescription className="text-sm">Send us a detailed message</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button variant="outline" className="w-full bg-transparent">
                Send Email
              </Button>
              <p className="text-xs text-slate-500 mt-2">We respond within 24 hours</p>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <Card className="border-2 border-slate-200 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-medium text-slate-800">
              <HelpCircle className="h-6 w-6" />
              Frequently Asked Questions
            </CardTitle>
            <CardDescription>Common questions and helpful answers</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-slate-800 hover:text-slate-600">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 leading-relaxed">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Contact Form */}
        <Card className="border-2 border-slate-200">
          <CardHeader>
            <CardTitle className="text-xl font-medium text-slate-800">Send Us a Message</CardTitle>
            <CardDescription>Can't find what you're looking for? We're here to help.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-slate-700">
                  Your Name
                </label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  className="border-2 border-slate-200 focus:border-blue-300"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-700">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="border-2 border-slate-200 focus:border-blue-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium text-slate-700">
                What do you need help with?
              </label>
              <Input
                id="subject"
                placeholder="Brief description of your question"
                className="border-2 border-slate-200 focus:border-blue-300"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium text-slate-700">
                Tell us more (optional)
              </label>
              <Textarea
                id="message"
                placeholder="Provide more details about what you need help with..."
                rows={4}
                className="border-2 border-slate-200 focus:border-blue-300"
              />
            </div>

            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Your privacy is important to us</p>
                <p>
                  We'll only use your information to help answer your question. We never share your details with anyone
                  else.
                </p>
              </div>
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Send Message</Button>
          </CardContent>
        </Card>

        {/* Additional Resources */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="h-5 w-5 text-red-500" />
            <span className="text-slate-600">Remember: You're not alone</span>
          </div>
          <p className="text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed">
            This website is designed to be a safe, supportive space. Take breaks when you need them, and remember that
            asking for help is a sign of strength, not weakness.
          </p>
        </div>
      </div>
    </div>
  )
}
