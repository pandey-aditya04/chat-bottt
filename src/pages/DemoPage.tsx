import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { SplineScene } from "@/components/ui/splite";
import { InteractiveRobotSpline } from "@/components/ui/interactive-3d-robot";
import { Card } from "@/components/ui/card";
import { Spotlight } from "@/components/ui/spotlight";
import { Boxes } from "@/components/ui/background-boxes";
import { FeaturesSection } from "@/components/ui/features-5";
import { WavePath } from "@/components/ui/wave-path";
import HeroFuturistic from "@/components/ui/hero-futuristic";
import StickyFooter from "@/components/ui/footer";
import AIMessageBar from "@/components/ui/ai-assistat";
import { cn } from "@/lib/utils";

export function WhobeeDemo() {
  const ROBOT_SCENE_URL = "https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode";

  return (
    <div className="relative w-full h-[600px] overflow-hidden rounded-3xl bg-slate-950 border border-white/5">
      <InteractiveRobotSpline
        scene={ROBOT_SCENE_URL}
        className="absolute inset-0 z-0" 
      />
      
      <div className="absolute inset-0 z-10 pt-20 px-8 pointer-events-none text-center text-white drop-shadow-lg">
        <h1 className="text-3xl md:text-5xl font-bold">
          Whobee: The Interactive 3D Robot
        </h1>
        <p className="mt-4 text-slate-400">Hover over him to see him respond!</p>
      </div>
    </div>
  );
}

export function SplineSceneBasic() {
  return (
    <Card className="w-full h-[500px] bg-black/[0.96] relative overflow-hidden">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      
      <div className="flex h-full flex-col md:flex-row">
        {/* Left content */}
        <div className="flex-1 p-8 relative z-10 flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
            Interactive 3D
          </h1>
          <p className="mt-4 text-neutral-300 max-w-lg">
            Bring your UI to life with beautiful 3D scenes. Create immersive experiences 
            that capture attention and enhance your design.
          </p>
        </div>

        {/* Right content */}
        <div className="flex-1 relative min-h-[300px]">
          <SplineScene 
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </div>
      </div>
    </Card>
  )
}

export function BackgroundBoxesDemo() {
  return (
    <div className="h-96 relative w-full overflow-hidden bg-slate-900 flex flex-col items-center justify-center rounded-lg">
      <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />

      <Boxes />
      <h1 className={cn("md:text-4xl text-xl text-white relative z-20")}>
        Tailwind is Awesome
      </h1>
      <p className="text-center mt-2 text-neutral-300 relative z-20">
        Framer motion is the best animation library ngl
      </p>
    </div>
  );
}

export function WavePathDemo() {
	return (
		<div className="relative w-full flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-white/5 bg-slate-950 overflow-hidden">
			<div
				aria-hidden="true"
				className={cn(
					'pointer-events-none absolute -top-10 left-1/2 h-full w-full -translate-x-1/2 rounded-full',
					'bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.1),transparent_50%)]',
					'blur-[30px]',
				)}
			/>

			<div className="flex w-[70vw] flex-col items-end">
				<WavePath className="mb-10" />
				<div className="flex w-full flex-col items-end">
					<div className="flex justify-end">
						<p className="text-muted-foreground mt-2 text-sm text-brand font-bold uppercase tracking-widest">Interactive Transition</p>
						<p className="text-text-secondary ml-8 w-3/4 text-xl md:text-2xl">
							Experience natural, fluid interactions. Hover over the line above to see the wave effect in action.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center gap-12 p-8 overflow-y-auto pb-32">
      <h1 className="text-4xl font-bold text-white mb-8 mt-12">Component Demo</h1>
      
      <section className="w-full max-w-5xl">
        <h2 className="text-xl text-zinc-500 mb-4">Interactive Wave Path</h2>
        <WavePathDemo />
      </section>

      <section className="w-full max-w-5xl">
        <h2 className="text-xl text-zinc-500 mb-4">Interactive Whobee Bot</h2>
        <WhobeeDemo />
      </section>

      <section className="w-full max-w-5xl">
        <h2 className="text-xl text-zinc-500 mb-4">Spline 3D Scene</h2>
        <SplineSceneBasic />
      </section>

      <section className="w-full max-w-5xl">
        <h2 className="text-xl text-zinc-500 mb-4">Background Boxes</h2>
        <BackgroundBoxesDemo />
      </section>

      <section className="w-full">
        <h2 className="text-xl text-zinc-500 mb-4 px-8">Futuristic WebGPU Hero</h2>
        <div className="w-full border-y border-white/5 relative">
          <HeroFuturistic />
        </div>
      </section>

      <section className="w-full max-w-5xl">
        <h2 className="text-xl text-zinc-500 mb-4">Grid Features</h2>
        <FeaturesSection />
      </section>

      <section className="w-full">
        <h2 className="text-xl text-zinc-500 mb-4 px-8">Sticky Footer Reveal</h2>
        <div className="h-[40vh] flex items-center justify-center bg-surface-raised rounded-t-3xl border-x border-t border-border">
            <p className="text-text-secondary animate-bounce">Scroll down to reveal the sticky footer ↓</p>
        </div>
        <StickyFooter />
      </section>

      <section className="w-full max-w-5xl">
        <h2 className="text-xl text-zinc-500 mb-4">AI Assistant Interface</h2>
        <AIMessageBar />
      </section>

      <section className="flex flex-col items-center gap-8">
        <h2 className="text-xl text-zinc-500">Liquid Glass Buttons</h2>
        <div className="relative h-[200px] w-[800px] max-w-full bg-slate-900 rounded-3xl border border-white/5 overflow-hidden flex items-center justify-center"> 
          <LiquidButton className="px-12 py-6 text-xl">
            Liquid Glass
          </LiquidButton> 
        </div>

        <div className="grid grid-cols-2 gap-8">
          <LiquidButton size="lg">Large Button</LiquidButton>
          <LiquidButton size="sm">Small Button</LiquidButton>
        </div>
      </section>
    </div>
  )
}
