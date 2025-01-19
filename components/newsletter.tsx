import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Newsletter() {
  return (
    <section className="py-12 bg-primary text-primary-foreground">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Stay Updated with QOINN</h2>
          <p className="max-w-[600px] text-black md:text-xl dark:text-zinc-100">
            Subscribe to our newsletter for the latest insights, performance updates, and exclusive offers.
          </p>
          <div className="w-full max-w-sm space-y-2">
            <form className="flex space-x-2">
              <Input
                className="flex-1 bg-primary-foreground text-primary"
                placeholder="Enter your email"
                type="email"
              />
              <Button type="submit" variant="secondary">Subscribe</Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

