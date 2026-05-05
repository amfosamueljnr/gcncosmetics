import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container section-grid">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="font-display text-xl font-bold text-foreground">
              GCN Cosmetics
            </Link>
            <p className="mt-4 font-body text-sm leading-relaxed text-muted-foreground">
              Premium lip care and hair care products made in Accra. Natural botanicals, formulated for African beauty.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="label-uppercase mb-4 text-foreground">Shop</h4>
            <ul className="space-y-3">
              {["Lip Balms", "Hair Oils", "Hair Treatments", "Styling Products", "Gift Sets"].map((item) => (
                <li key={item}>
                  <Link to="/shop" className="font-body text-sm text-muted-foreground transition-colors hover:text-accent">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="label-uppercase mb-4 text-foreground">Company</h4>
            <ul className="space-y-3">
              {["About Us", "Our Ingredients", "Sustainability", "Careers", "Press"].map((item) => (
                <li key={item}>
                  <Link to="/about" className="font-body text-sm text-muted-foreground transition-colors hover:text-accent">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="label-uppercase mb-4 text-foreground">Support</h4>
            <ul className="space-y-3">
              {["Contact Us", "Shipping & Returns", "Hair Care Guide", "Lip Care Guide", "Bulk Orders"].map((item) => (
                <li key={item}>
                  <Link to="/contact" className="font-body text-sm text-muted-foreground transition-colors hover:text-accent">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="font-body text-xs text-muted-foreground">
            © {new Date().getFullYear()} GCN Cosmetics. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
              <Link key={item} to="/" className="font-body text-xs text-muted-foreground transition-colors hover:text-accent">
                {item}
              </Link>
            ))}
            <Link to="/admin/login" className="font-body text-xs text-muted-foreground transition-colors hover:text-accent">
              Admin dashboard
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
