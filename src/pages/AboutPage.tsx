import { motion } from "framer-motion";
import { Heart, Globe, Sparkles, Users } from "lucide-react";
import heroImage1 from "@/assets/image copy.png";
import heroImage2 from "@/assets/image copy 2.png";
import categoryHair from "@/assets/kiss-me.png";
import categorySkin from "@/assets/cat1.jpeg";

const spring = { type: "spring" as const, duration: 0.5, bounce: 0.2 };

const values = [
  { icon: Heart, title: "Made in Ghana", description: "Every formula is blended and bottled in our Accra workshop — thoughtfully crafted, rigorously tested." },
  { icon: Globe, title: "Naturally Sourced", description: "Raw shea, argan oil, moringa, rosemary — only the finest African botanicals, ethically harvested." },
  { icon: Sparkles, title: "Lip & Hair Expertise", description: "Formulated specifically for African hair textures and complexions by trained cosmetic chemists." },
  { icon: Users, title: "Clean & Conscious", description: "Free from parabens, silicones and synthetic dyes. Recyclable packaging. Never tested on animals." },
];

const team = [
  { name: "Nana Adwoa Sarpong", role: "Founder & Formulator", location: "Accra, Ghana", image: categoryHair },
  { name: "Kojo Antwi", role: "Head of Product", location: "Kumasi, Ghana", image: categorySkin },
  { name: "Selasi Agbeko", role: "Sourcing Director", location: "Accra, Ghana", image: heroImage1 },
];

export default function AboutPage() {
  return (
    <main>
      <h1 className="sr-only">About GCN Cosmetics</h1>

      <section className="section-editorial">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={spring}>
              <p className="label-uppercase text-accent mb-4">Our Story</p>
              <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground leading-[1] tracking-[-0.03em]">
                Lip & Hair Care from Accra
              </h2>
              <p className="mt-6 font-body text-base leading-relaxed text-muted-foreground">
                GCN Cosmetics began with a simple belief: the world needs better lip care and hair products—ones that work for African hair and skin. Founded in Accra, we combine ancestral botanicals with modern cosmetic science to create formulas that truly perform.
              </p>
              <p className="mt-4 font-body text-base leading-relaxed text-muted-foreground">
                From nourishing hair oils to moisturizing lip balms, every product is formulated slowly, tested rigorously, and designed for real results. We believe beautiful lips and healthy hair start with intention.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...spring, delay: 0.2 }}
              className="overflow-hidden rounded-card aspect-[4/5]"
            >
              <img src={heroImage1} alt="GCN Cosmetics botanical skincare" className="h-full w-full object-cover" />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-grid bg-secondary/40">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={spring}
              className="rounded-card bg-card p-8 md:p-10 shadow-card"
            >
              <p className="label-uppercase text-accent mb-3">Our Mission</p>
              <h3 className="font-display text-2xl font-bold text-foreground tracking-[-0.02em]">
                Lips & Hair That Shine
              </h3>
              <p className="mt-4 font-body text-sm leading-relaxed text-muted-foreground">
                To create the world's most effective lip care and hair care products—formulated specifically for African beauty, grounded in botanical science, and made with uncompromising intent.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...spring, delay: 0.1 }}
              className="rounded-card bg-card p-8 md:p-10 shadow-card"
            >
              <p className="label-uppercase text-accent mb-3">Our Vision</p>
              <h3 className="font-display text-2xl font-bold text-foreground tracking-[-0.02em]">
                Africa's Beauty Experts
              </h3>
              <p className="mt-4 font-body text-sm leading-relaxed text-muted-foreground">
                A future where African-formulated lip and hair care are the gold standard globally—created with botanical wisdom, tested on real hair and skin, and shipped with pride from Accra.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-editorial">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={spring}
              className="order-2 lg:order-1 overflow-hidden rounded-card aspect-[4/5]"
            >
              <img src={heroImage2} alt="Botanical ingredients" className="h-full w-full object-cover" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={spring}
              className="order-1 lg:order-2"
            >
              <p className="label-uppercase text-accent mb-4">The Formula</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground tracking-[-0.03em]">
                Nourish. Strengthen. Shine.
              </h2>
              <p className="mt-6 font-body text-base leading-relaxed text-muted-foreground">
                Every hair ritual follows the same wisdom: cleanse, treat with active botanicals, and seal with rich moisture. Our lip balms deliver lasting hydration and natural color. Together, they work—no conflicting ingredients, no compromise.
              </p>
              <p className="mt-4 font-body text-base leading-relaxed text-muted-foreground">
                Whether you're nourishing textured hair with argan and shea oils or protecting your lips with botanical balms, our products layer beautifully and deliver results you can see and feel.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-grid bg-secondary/40">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={spring}
            className="mb-12 text-center"
          >
            <p className="label-uppercase text-accent mb-2">What We Stand For</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground tracking-[-0.03em]">Our Values</h2>
          </motion.div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...spring, delay: i * 0.1 }}
                className="rounded-card bg-card p-6 shadow-card text-center"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/15">
                  <v.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground">{v.title}</h3>
                <p className="mt-2 font-body text-sm text-muted-foreground">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* <section className="section-editorial">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={spring}
            className="mb-12 text-center"
          >
            <p className="label-uppercase text-accent mb-2">Meet the House</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground tracking-[-0.03em]">Our Team</h2>
            <p className="mx-auto mt-4 max-w-xl font-body text-sm text-muted-foreground">
              The small team behind every GCN Cosmetics formula.
            </p>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-3">
            {team.map((a, i) => (
              <motion.div
                key={a.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...spring, delay: i * 0.1 }}
                className="group overflow-hidden rounded-card"
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img src={a.image} alt={a.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                </div>
                <div className="bg-card p-5 shadow-card">
                  <h3 className="font-display text-lg font-bold text-foreground">{a.name}</h3>
                  <p className="font-body text-sm text-accent">{a.role}</p>
                  <p className="font-body text-xs text-muted-foreground">{a.location}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}
    </main>
  );
}
