import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Users, Target, Shield, Star, ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-accent/5">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <Heart className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl text-balance">
              Find Your Perfect Match Through <span className="text-primary">Purpose</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground text-pretty">
              Connect with like-minded professionals who share your values, goals, and life purpose. Our sophisticated
              matching algorithm goes beyond surface-level compatibility.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild size="lg" className="text-lg px-8 py-3">
                <Link href="/signup">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" asChild size="lg" className="text-lg px-8 py-3 bg-transparent">
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
              Why Choose Pup?
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground text-pretty">
              We believe meaningful relationships start with shared purpose and values.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-foreground">
                  <Target className="h-5 w-5 flex-none text-primary" />
                  Purpose-Driven Matching
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">
                    Our unique algorithm matches you based on life purpose, values, and long-term goals, not just
                    interests and photos.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-foreground">
                  <Shield className="h-5 w-5 flex-none text-primary" />
                  Verified Professionals
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">
                    All profiles are verified for authenticity. Connect with genuine professionals who are serious about
                    finding meaningful relationships.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-foreground">
                  <Users className="h-5 w-5 flex-none text-primary" />
                  Quality Over Quantity
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">
                    Receive carefully curated matches based on deep compatibility analysis, ensuring higher quality
                    connections.
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-accent/5 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
              Success Stories
            </h2>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {[
              {
                name: "Sarah & Michael",
                role: "Software Engineers",
                content:
                  "We connected over our shared passion for sustainable technology. Six months later, we're planning our future together.",
                rating: 5,
              },
              {
                name: "Priya & David",
                role: "Healthcare Professionals",
                content:
                  "The purpose-based matching helped us find someone who truly understands our dedication to helping others.",
                rating: 5,
              },
              {
                name: "Emma & James",
                role: "Entrepreneurs",
                content:
                  "Finally found someone who shares my entrepreneurial spirit and values. The compatibility score was spot on!",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <Card key={index} className="bg-background">
                <CardHeader>
                  <div className="flex items-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                  <CardDescription>{testimonial.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{testimonial.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
              Choose Your Plan
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground text-pretty">
              Start your journey to meaningful connections today.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-8 lg:max-w-4xl lg:grid-cols-3">
            {[
              {
                name: "Free",
                price: "$0",
                description: "Perfect for getting started",
                features: ["5 matches per month", "Basic profile", "Standard support"],
                cta: "Get Started",
                popular: false,
              },
              {
                name: "Premium",
                price: "$29",
                description: "Most popular choice",
                features: ["Unlimited matches", "Advanced filters", "Priority support", "Read receipts"],
                cta: "Start Premium",
                popular: true,
              },
              {
                name: "Elite",
                price: "$59",
                description: "For serious professionals",
                features: ["Everything in Premium", "Personal matchmaker", "Profile optimization", "Exclusive events"],
                cta: "Go Elite",
                popular: false,
              },
            ].map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? "border-primary" : ""}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.price !== "$0" && <span className="text-muted-foreground">/month</span>}
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <Heart className="h-4 w-4 text-primary mr-2" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" variant={plan.popular ? "default" : "outline"} asChild>
                    <Link href="/signup">{plan.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl text-balance">
              Ready to Find Your Perfect Match?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-primary-foreground/80 text-pretty">
              Join thousands of professionals who have found meaningful relationships through purpose-driven matching.
            </p>
            <div className="mt-10">
              <Button size="lg" variant="secondary" asChild className="text-lg px-8 py-3">
                <Link href="/signup">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
