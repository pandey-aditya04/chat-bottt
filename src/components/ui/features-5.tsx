import { Activity, MessageSquare, Zap, Layout } from 'lucide-react'

export function FeaturesSection() {
    return (
        <section className="py-16 md:py-32 bg-surface">
            <div className="mx-auto max-w-xl md:max-w-6xl px-6">
                <div className="grid items-center gap-12 md:grid-cols-2 md:gap-12 lg:grid-cols-5 lg:gap-24">
                    <div className="lg:col-span-2">
                        <div className="md:pr-6 lg:pr-0">
                            <h2 className="text-4xl font-semibold lg:text-5xl gradient-text">Built for Scaling Support</h2>
                            <p className="mt-6 text-text-secondary leading-relaxed">
                                Our AI chatbots are designed to handle thousands of conversations simultaneously, 
                                ensuring your customers always get the help they need without the wait.
                            </p>
                        </div>
                        <ul className="mt-8 divide-y divide-border border-y border-border *:flex *:items-center *:gap-3 *:py-4 text-text-primary font-medium">
                            <li>
                                <MessageSquare className="size-5 text-brand" />
                                24/7 AI-Powered Support
                            </li>
                            <li>
                                <Zap className="size-5 text-brand" />
                                Instant Response Time
                            </li>
                            <li>
                                <Activity className="size-5 text-brand" />
                                Detailed Conversation Analytics
                            </li>
                            <li>
                                <Layout className="size-5 text-brand" />
                                Fully Customizable Branding
                            </li>
                        </ul>
                    </div>
                    <div className="border-border/50 relative rounded-3xl border p-3 lg:col-span-3 bg-surface-raised/50 backdrop-blur-sm">
                        <div className="aspect-76/59 relative rounded-2xl overflow-hidden shadow-2xl">
                            <img 
                                src="/chatbot_analytics_dashboard.png" 
                                className="w-full h-full object-cover" 
                                alt="AI Chatbot Dashboard Analytics" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-40" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
