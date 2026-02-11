import { SignIn } from "@clerk/nextjs";
import MouseEffectCard from "@/components/ui/mouse-effect-card";

export default function Page() {
    return (
        <div className="min-h-screen bg-neutral-950">
            <MouseEffectCard
                fullScreen={true}
                title="Welcome Back"
                topText="PortfolioGen"
                topSubtext="Build smarter, faster"
                footerText="Secure Login via Clerk"
                className="bg-neutral-950 border-0"
                dotSpacing={14}
            >
                <div className="flex justify-center w-full py-12">
                    <SignIn appearance={{
                        variables: {
                            colorText: "white",
                            colorPrimary: "#9333ea",
                            colorTextSecondary: "#a1a1aa",
                            colorBackground: "transparent",
                            colorInputBackground: "#18181b",
                            colorInputText: "white",
                        },
                        elements: {
                            rootBox: "w-full max-w-sm",
                            card: "shadow-none bg-transparent border-none w-full",
                            headerTitle: "hidden",
                            headerSubtitle: "text-center text-zinc-400",
                            socialButtonsBlockButton: "bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700",
                            formButtonPrimary: "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 border-0",
                            footerActionLink: "text-purple-400 hover:text-purple-300",
                            formFieldLabel: "text-zinc-300",
                            dividerLine: "bg-zinc-800",
                            dividerText: "text-zinc-500"
                        }
                    }} />
                </div>
            </MouseEffectCard>
        </div>
    );
}
