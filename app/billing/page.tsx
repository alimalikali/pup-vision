"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/layout/navbar"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  CreditCard,
  Check,
  Crown,
  Star,
  Calendar,
  DollarSign,
  Download,
  AlertCircle,
  Zap,
  Heart,
  Users,
  Shield,
  Loader2,
} from "lucide-react"
import { useBillingStore, useAuthStore } from "@/lib/store"

export default function BillingPage() {
  const { subscription, paymentHistory, isLoading, fetchBilling, changePlan, cancelSubscription } = useBillingStore()
  const { user, updateUser } = useAuthStore()
  const [isChangingPlan, setIsChangingPlan] = useState(false)

  useEffect(() => {
    fetchBilling()
  }, [fetchBilling])

  const plans = [
    {
      id: "free",
      name: "Free",
      price: 0,
      interval: "month",
      description: "Perfect for getting started",
      features: ["5 matches per month", "Basic profile", "Standard support", "Basic purpose matching"],
      limitations: ["Limited matches", "No advanced filters", "No read receipts"],
      popular: false,
      current: subscription?.plan === "free",
    },
    {
      id: "premium",
      name: "Premium",
      price: 29.99,
      interval: "month",
      description: "Most popular choice",
      features: [
        "Unlimited matches",
        "Advanced filters",
        "Priority support",
        "Read receipts",
        "See who liked you",
        "Boost your profile",
        "Advanced purpose insights",
      ],
      popular: true,
      current: subscription?.plan === "premium",
    },
    {
      id: "elite",
      name: "Elite",
      price: 59.99,
      interval: "month",
      description: "For serious professionals",
      features: [
        "Everything in Premium",
        "Personal matchmaker",
        "Profile optimization",
        "Exclusive events",
        "Priority matching",
        "Concierge support",
        "Advanced compatibility analysis",
      ],
      popular: false,
      current: subscription?.plan === "elite",
    },
  ]

  const handlePlanChange = async (planId: string) => {
    setIsChangingPlan(true)
    const success = await changePlan(planId)

    if (success && user) {
      // Update user subscription in auth store
      updateUser({
        subscription: {
          ...user.subscription,
          plan: planId as "free" | "premium" | "elite",
        },
      })
    }

    setIsChangingPlan(false)
  }

  const handleCancelSubscription = async () => {
    const success = await cancelSubscription()

    if (success && user) {
      // Update user subscription status in auth store
      updateUser({
        subscription: {
          ...user.subscription,
          status: "cancelled" as const,
        },
      })
    }
  }

  const currentPlan = plans.find((p) => p.current)

  if (isLoading || !subscription) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background">
          <Navbar />
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading billing information...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar />

        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Billing & Subscription</h1>
            <p className="mt-2 text-muted-foreground">Manage your subscription and billing information</p>
          </div>

          <Tabs defaultValue="subscription" className="space-y-6">
            <TabsList>
              <TabsTrigger value="subscription">Subscription</TabsTrigger>
              <TabsTrigger value="plans">Plans</TabsTrigger>
              <TabsTrigger value="history">Payment History</TabsTrigger>
            </TabsList>

            <TabsContent value="subscription" className="space-y-6">
              {/* Current Subscription */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        <Crown className="mr-2 h-5 w-5 text-primary" />
                        Current Subscription
                      </CardTitle>
                      <CardDescription>Your active plan and billing details</CardDescription>
                    </div>
                    <Badge
                      className={
                        subscription.status === "active" ? "bg-green-500 text-white" : "bg-yellow-500 text-white"
                      }
                    >
                      {subscription.status === "active" ? "Active" : "Cancelled"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-2xl font-bold">{currentPlan?.name} Plan</h3>
                        <p className="text-muted-foreground">{currentPlan?.description}</p>
                      </div>
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold">${subscription.amount}</span>
                        <span className="text-muted-foreground ml-1">/{subscription.currency.toLowerCase()}</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>Next billing: {new Date(subscription.currentPeriodEnd).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center">
                          <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>Payment method: •••• •••• •••• 4242</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold">Plan Features</h4>
                      <ul className="space-y-2">
                        {currentPlan?.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-sm">
                            <Check className="mr-2 h-4 w-4 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 pt-4 border-t">
                    <Button variant="outline" className="bg-transparent">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Update Payment Method
                    </Button>
                    {subscription.status === "active" && (
                      <Button variant="outline" onClick={handleCancelSubscription} className="bg-transparent">
                        Cancel Subscription
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Usage Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Matches This Month</CardTitle>
                    <Heart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">47</div>
                    <p className="text-xs text-muted-foreground">
                      {subscription.plan === "free" ? "5 per month limit" : "Unlimited on Premium+"}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">156</div>
                    <p className="text-xs text-muted-foreground">+23% from last month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Boosts Used</CardTitle>
                    <Zap className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3</div>
                    <p className="text-xs text-muted-foreground">
                      {subscription.plan === "free" ? "Not available" : "2 remaining this month"}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="plans" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Choose Your Plan</h2>
                <p className="text-muted-foreground">Upgrade or downgrade your subscription anytime</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <Card key={plan.id} className={`relative ${plan.popular ? "border-primary" : ""}`}>
                    {plan.popular && (
                      <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                        Most Popular
                      </Badge>
                    )}
                    {plan.current && (
                      <Badge className="absolute -top-3 right-4 bg-green-500 text-white">Current Plan</Badge>
                    )}

                    <CardHeader className="text-center">
                      <div className="flex justify-center mb-4">
                        {plan.id === "free" && <Shield className="h-8 w-8 text-muted-foreground" />}
                        {plan.id === "premium" && <Star className="h-8 w-8 text-primary" />}
                        {plan.id === "elite" && <Crown className="h-8 w-8 text-yellow-500" />}
                      </div>
                      <CardTitle className="text-2xl">{plan.name}</CardTitle>
                      <div className="mt-4">
                        <span className="text-4xl font-bold">${plan.price}</span>
                        {plan.price > 0 && <span className="text-muted-foreground">/{plan.interval}</span>}
                      </div>
                      <CardDescription className="mt-2">{plan.description}</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <ul className="space-y-2">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-sm">
                            <Check className="mr-2 h-4 w-4 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      {plan.limitations && (
                        <div className="pt-4 border-t">
                          <p className="text-xs text-muted-foreground mb-2">Limitations:</p>
                          <ul className="space-y-1">
                            {plan.limitations.map((limitation, index) => (
                              <li key={index} className="flex items-center text-xs text-muted-foreground">
                                <AlertCircle className="mr-2 h-3 w-3" />
                                {limitation}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <Button
                        className="w-full"
                        variant={plan.current ? "outline" : plan.popular ? "default" : "outline"}
                        onClick={() => handlePlanChange(plan.id)}
                        disabled={plan.current || isChangingPlan}
                      >
                        {isChangingPlan ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : plan.current ? (
                          "Current Plan"
                        ) : (
                          `Switch to ${plan.name}`
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Plan changes take effect immediately. You'll be charged or credited the prorated amount for the
                  remainder of your billing period.
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="mr-2 h-5 w-5" />
                    Payment History
                  </CardTitle>
                  <CardDescription>Your billing and payment history</CardDescription>
                </CardHeader>
                <CardContent>
                  {paymentHistory.length > 0 ? (
                    <div className="space-y-4">
                      {paymentHistory.map((payment) => (
                        <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="p-2 bg-green-100 rounded-full">
                              <Check className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium">{payment.plan} Plan</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(payment.date).toLocaleDateString()} • {payment.invoice}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="font-medium">${payment.amount}</p>
                              <Badge variant="secondary" className="text-xs">
                                {payment.status}
                              </Badge>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}

                      <div className="mt-6 text-center">
                        <Button variant="outline" className="bg-transparent">
                          Load More History
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No payment history</h3>
                      <p className="text-muted-foreground">
                        Your payment history will appear here once you make your first payment.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  )
}
