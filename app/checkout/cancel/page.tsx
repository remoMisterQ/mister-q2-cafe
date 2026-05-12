import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function CheckoutCancelPage() {
  return (
    <main className="section-pad">
      <div className="container-page grid place-items-center">
        <Card className="max-w-xl">
          <CardContent className="p-8 text-center">
            <h1 className="text-3xl font-black text-espresso">Checkout cancelled</h1>
            <p className="mt-3 leading-7 text-stone-600">Your cart was not charged. Return to your pickup order when you are ready.</p>
            <Button className="mt-6" asChild>
              <Link href="/order">
                <ArrowLeft size={17} />
                Return to cart
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
