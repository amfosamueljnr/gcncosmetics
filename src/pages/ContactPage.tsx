import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Instagram, Facebook, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const spring = { type: "spring" as const, duration: 0.5, bounce: 0.2 };

const contactInfo = [
  { icon: Mail, label: "Email", value: "globalchoicenaturals@gmail.com", href: "mailto:globalchoicenaturals@gmail.com" },
  { icon: Phone, label: "Phone", value: "+233 599 551 592", href: "tel:+233599551592" },
  { icon: MapPin, label: "Studio", value: "12 Cantonments Road, Accra, Ghana", href: "#" },
];

const socials = [
  { icon: Instagram, label: "Instagram", href: "https://instagram.com" },
  { icon: Facebook, label: "Facebook", href: "https://facebook.com" },
  { icon: Twitter, label: "Twitter", href: "https://twitter.com" },
];

export default function ContactPage() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setForm({ name: "", email: "", subject: "", message: "" });
      toast({ title: "Message sent!", description: "We'll get back to you within 24 hours." });
    }, 1000);
  };

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <main>
      <h1 className="sr-only">Contact GCN Cosmetics</h1>

      <section className="section-editorial">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={spring} className="mb-16 text-center">
            <p className="label-uppercase text-accent mb-2">Get in Touch</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground tracking-[-0.03em]">Contact Us</h2>
            <p className="mx-auto mt-4 max-w-lg font-body text-sm text-muted-foreground">
              Have a question about your order, need hair or lip care advice, or interested in a bulk enquiry? We'd love to hear from you.
            </p>
          </motion.div>

          <div className="grid gap-12 lg:grid-cols-5">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.1 }}
              className="lg:col-span-3"
            >
              <form onSubmit={handleSubmit} className="rounded-card bg-card p-8 shadow-card space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="label-uppercase text-[11px] text-muted-foreground mb-2 block">Name</label>
                    <Input value={form.name} onChange={update("name")} placeholder="Your full name" required />
                  </div>
                  <div>
                    <label className="label-uppercase text-[11px] text-muted-foreground mb-2 block">Email</label>
                    <Input type="email" value={form.email} onChange={update("email")} placeholder="you@example.com" required />
                  </div>
                </div>
                <div>
                  <label className="label-uppercase text-[11px] text-muted-foreground mb-2 block">Subject</label>
                  <Input value={form.subject} onChange={update("subject")} placeholder="How can we help?" required />
                </div>
                <div>
                  <label className="label-uppercase text-[11px] text-muted-foreground mb-2 block">Message</label>
                  <Textarea value={form.message} onChange={update("message")} placeholder="Tell us more..." rows={5} required />
                </div>
                <Button type="submit" disabled={sending} className="w-full gap-2">
                  {sending ? "Sending..." : <><Send className="h-4 w-4" /> Send Message</>}
                </Button>
              </form>
            </motion.div>

            {/* Info sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.2 }}
              className="lg:col-span-2 space-y-6"
            >
              <div className="rounded-card bg-card p-6 shadow-card space-y-5">
                <h3 className="font-display text-lg font-bold text-foreground">Customer Care</h3>
                <p className="font-body text-sm text-muted-foreground">
                  Our team is available Monday–Saturday, 9AM–6PM GMT. We respond to all inquiries within 24 hours.
                </p>
                {contactInfo.map((c) => (
                  <a key={c.label} href={c.href} className="flex items-start gap-3 group">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <c.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="label-uppercase text-[11px] text-muted-foreground">{c.label}</p>
                      <p className="font-body text-sm text-foreground group-hover:text-primary transition-colors">{c.value}</p>
                    </div>
                  </a>
                ))}
              </div>

              <div className="rounded-card bg-card p-6 shadow-card">
                <h3 className="font-display text-lg font-bold text-foreground mb-4">Follow Us</h3>
                <div className="flex gap-3">
                  {socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                    >
                      <s.icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>

              <div className="rounded-card bg-secondary/60 aspect-[4/3] flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="mx-auto h-8 w-8 text-muted-foreground/40" />
                  <p className="mt-2 font-body text-xs text-muted-foreground">Map</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* FAQ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={spring}
            className="mt-20"
          >
            <h3 className="font-display text-2xl font-bold text-foreground text-center mb-8">Frequently Asked Questions</h3>
            <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
              {[
                { q: "How long does shipping take?", a: "Free same-day delivery in Accra. Nationwide: 2–4 business days. International: 7–10 business days." },
                { q: "Are your products safe for sensitive skin?", a: "Yes — most of our formulas are designed for sensitive skin. Always patch-test new products and check the ingredients list." },
                { q: "What is your return policy?", a: "Unopened products can be returned within 14 days of delivery, with original packaging." },
                { q: "Are your products cruelty-free?", a: "Always. We never test on animals, and our packaging is recyclable wherever possible." },
              ].map((faq) => (
                <div key={faq.q} className="rounded-card bg-card p-6 shadow-card">
                  <h4 className="font-body text-sm font-semibold text-foreground">{faq.q}</h4>
                  <p className="mt-2 font-body text-sm text-muted-foreground">{faq.a}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
