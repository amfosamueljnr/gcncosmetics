import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const spring = { type: "spring" as const, duration: 0.5, bounce: 0.2 };

const concerns = [
  "Dry / Damaged Hair",
  "Hair Growth & Thinning",
  "Frizz & Breakage",
  "Textured Hair Moisture",
  "Dry Lips",
  "Lip Color & Tone",
  "Sensitive Lips",
  "Other",
];
const skinTypes = ["Oily", "Dry", "Combination", "Normal", "Sensitive"];
const formats = ["Oil", "Butter / Balm", "Cream", "Serum", "Leave-in Treatment", "Lip Balm"];

export default function CustomOrderPage() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    concern: "",
    skinType: "",
    format: "",
    favourites: "",
    avoidIngredients: "",
    notes: "",
  });

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast({ title: "Request submitted!", description: "Our formulator will review your bespoke request." });
  };

  if (submitted) {
    return (
      <main className="section-editorial">
        <div className="container flex items-center justify-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={spring} className="text-center max-w-md">
            <CheckCircle className="mx-auto h-16 w-16 text-primary mb-6" />
            <h2 className="font-display text-3xl font-bold text-foreground">Request Received</h2>
            <p className="mt-4 font-body text-sm text-muted-foreground">
              Thank you for commissioning a bespoke hair or lip care formula. Our formulator will review your brief and respond within 3–5 business days with a proposed blend and quote.
            </p>
            <Button onClick={() => setSubmitted(false)} className="mt-8">Submit Another Request</Button>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <h1 className="sr-only">Bespoke Beauty Formulation Request</h1>
      <section className="section-editorial">
        <div className="container max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={spring} className="text-center mb-12">
            <p className="label-uppercase text-primary mb-2">Bespoke</p>
            <h2 className="font-display text-4xl font-bold text-foreground tracking-[-0.03em]">Commission a Custom Hair or Lip Care Formula</h2>
            <p className="mt-4 font-body text-sm text-muted-foreground">
              Tell us about your hair texture or lip concerns. Our formulator will craft a bespoke blend with natural African botanicals, made exclusively for you.
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.1 }}
            onSubmit={handleSubmit}
            className="rounded-card bg-card p-8 shadow-card space-y-6"
          >
            <div>
              <label className="label-uppercase text-[11px] text-muted-foreground mb-2 block">Primary Concern (Hair or Lip)</label>
              <select value={form.concern} onChange={update("concern")} required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <option value="">Select concern...</option>
                {concerns.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="label-uppercase text-[11px] text-muted-foreground mb-2 block">Hair or Lip Type</label>
              <select value={form.skinType} onChange={update("skinType")} required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <option value="">Select type...</option>
                {skinTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="label-uppercase text-[11px] text-muted-foreground mb-2 block">Preferred Format</label>
              <select value={form.format} onChange={update("format")} required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <option value="">Select format...</option>
                {formats.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>

            <div>
              <label className="label-uppercase text-[11px] text-muted-foreground mb-2 block">Products you currently love</label>
              <Input value={form.favourites} onChange={update("favourites")} placeholder="e.g. raw shea butter, rosehip oil, aloe gel" />
            </div>

            <div>
              <label className="label-uppercase text-[11px] text-muted-foreground mb-2 block">Ingredients to avoid</label>
              <Input value={form.avoidIngredients} onChange={update("avoidIngredients")} placeholder="e.g. fragrance, coconut oil, essential oils" />
            </div>

            <div>
              <label className="label-uppercase text-[11px] text-muted-foreground mb-2 block">Reference Image (optional)</label>
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-input p-8 text-muted-foreground transition-colors hover:border-primary hover:text-primary">
                <Upload className="h-5 w-5" />
                <span className="font-body text-sm">Upload a reference or inspiration image</span>
                <input type="file" accept="image/*" className="hidden" />
              </label>
            </div>

            <div>
              <label className="label-uppercase text-[11px] text-muted-foreground mb-2 block">Additional Notes</label>
              <Textarea value={form.notes} onChange={update("notes")} placeholder="Tell us about your skin or hair journey and the result you're hoping for..." rows={4} />
            </div>

            <Button type="submit" className="w-full">Submit Bespoke Request</Button>
          </motion.form>
        </div>
      </section>
    </main>
  );
}
