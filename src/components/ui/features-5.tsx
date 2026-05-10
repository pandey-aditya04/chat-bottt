import { Activity, MessageSquare, Zap, Layout } from 'lucide-react'

export function FeaturesSection() {
    return (
        <section className="py-16 md:py-32 bg-surface">
            <div className="mx-auto max-w-3xl px-6 text-center">
                <h2 className="text-4xl font-semibold lg:text-5xl gradient-text">Built for Scaling Support</h2>
                <p className="mt-6 text-text-secondary leading-relaxed text-lg">
                    Our AI chatbots are designed to handle thousands of conversations simultaneously, 
                    ensuring your customers always get the help they need without the wait.
                </p>
                
                <div className="mt-12 grid sm:grid-cols-2 gap-4 text-left">
                    <div className="flex items-center gap-3 p-6 rounded-2xl border border-border bg-surface-raised hover:border-brand/30 transition-colors">
                        <MessageSquare className="size-6 text-brand shrink-0" />
                        <span className="text-text-primary font-medium">24/7 AI-Powered Support</span>
                    </div>
                    <div className="flex items-center gap-3 p-6 rounded-2xl border border-border bg-surface-raised hover:border-brand/30 transition-colors">
                        <Zap className="size-6 text-brand shrink-0" />
                        <span className="text-text-primary font-medium">Instant Response Time</span>
                    </div>
                    <div className="flex items-center gap-3 p-6 rounded-2xl border border-border bg-surface-raised hover:border-brand/30 transition-colors">
                        <Activity className="size-6 text-brand shrink-0" />
                        <span className="text-text-primary font-medium">Detailed Conversation Analytics</span>
                    </div>
                    <div className="flex items-center gap-3 p-6 rounded-2xl border border-border bg-surface-raised hover:border-brand/30 transition-colors">
                        <Layout className="size-6 text-brand shrink-0" />
                        <span className="text-text-primary font-medium">Fully Customizable Branding</span>
                    </div>
                </div>
            </div>
        </section>
    )
}
