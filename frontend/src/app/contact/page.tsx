"use client";
import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Phone, MessageCircle, MapPin, Clock, CheckCircle } from "lucide-react";
import { buildContactFormURL, buildWhatsAppURL } from "@/lib/whatsapp";

const serviceOptions = [
  "Birthday Decorations", "Anniversary Decorations", "Wedding Decorations",
  "Baby Shower", "Candlelight Dinner", "Bachelorette Party", "Engagement Ceremony",
  "Corporate Events", "Festival Decorations", "Virtual Events", "Kids Birthday Party",
  "Outdoor Party", "Premium Luxury Decor", "Proposal Setup", "Customised Decor", "Other",
];

function FloatingInput({
  label, name, type = "text", value, onChange, required = false,
}: {
  label: string; name: string; type?: string;
  value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;

  return (
    <div className="relative pt-5">
      <motion.label
        htmlFor={name}
        className="absolute left-0 font-cinzel text-xs tracking-wider uppercase pointer-events-none"
        animate={{
          top: active ? 0 : "1.4rem",
          color: active ? "#00A693" : "#4A7C7C",
          fontSize: active ? "0.6rem" : "0.7rem",
        }}
        transition={{ duration: 0.18 }}
      >
        {label}{required && " *"}
      </motion.label>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        required={required}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full bg-transparent border-b-2 border-primary/20 focus:border-primary pb-2 pt-3 font-dm text-light text-sm focus:outline-none transition-colors"
      />
    </div>
  );
}

export default function ContactPage() {
  const [form, setForm]       = useState({ name: "", phone: "", service: "", date: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const reduced = useReducedMotion();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = buildContactFormURL(form.name, form.service || "decoration", form.date || "a suitable date", form.phone);
    window.open(url, "_blank");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3500);
  };

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4 bg-dark-card overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container-max text-center relative z-10">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-cinzel text-xs tracking-[0.3em] text-primary uppercase">Get In Touch</span>
            <h1 className="section-heading mt-2">
              Contact{" "}
              <em className="font-cormorant not-italic text-gradient-gold">Us</em>
            </h1>
            <p className="font-dm text-text-muted text-lg mt-4 max-w-xl mx-auto">
              Ready to make your event magical? Reach out and we&apos;ll get back to you within 2 hours!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact methods + form */}
      <section className="section-padding bg-dark">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Contact methods */}
            <motion.div
              initial={reduced ? false : { opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-playfair text-2xl font-bold text-primary mb-8">Reach Out To Us</h2>
              <div className="space-y-5">
                {[
                  { href: "tel:8884447579",   icon: <Phone size={20} className="text-primary group-hover:text-white transition-colors" />,              bg: "bg-primary/15 group-hover:bg-primary",        label: "Phone",     value: "8884447579",   sub: "Tap to call directly" },
                  { href: buildWhatsAppURL(), icon: <MessageCircle size={20} className="text-[#25D366] group-hover:text-white transition-colors" />,    bg: "bg-[#25D366]/15 group-hover:bg-[#25D366]",   label: "WhatsApp",  value: "Message Us",   sub: "We reply within 2 hours" },
                ].map((item) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    whileHover={reduced ? {} : { x: 4 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-4 glass-card rounded-2xl p-5 group hover:border-primary/50 transition-all"
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${item.bg}`}>{item.icon}</div>
                    <div>
                      <div className="font-cinzel text-xs text-text-muted uppercase tracking-wider mb-0.5">{item.label}</div>
                      <div className="font-dm font-semibold text-light text-lg">{item.value}</div>
                      <div className="font-dm text-text-muted text-sm">{item.sub}</div>
                    </div>
                  </motion.a>
                ))}
                {[
                  { icon: <MapPin size={20} className="text-primary" />,  label: "Address", value: "23rd Main Rd, JC Nagar, Nandini Layout, Bengaluru – 560086", sub: "Karnataka, India" },
                  { icon: <Clock size={20} className="text-primary" />,   label: "Hours",   value: "9 AM – 9 PM",  sub: "7 days a week" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-4 glass-card rounded-2xl p-5">
                    <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">{item.icon}</div>
                    <div>
                      <div className="font-cinzel text-xs text-text-muted uppercase tracking-wider mb-0.5">{item.label}</div>
                      <div className="font-dm font-semibold text-light">{item.value}</div>
                      <div className="font-dm text-text-muted text-sm">{item.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={reduced ? false : { opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="glass-card rounded-2xl p-8">
                <h2 className="font-playfair text-2xl font-bold text-primary mb-2">Quick Enquiry</h2>
                <p className="font-dm text-text-muted text-sm mb-8">Fill in your details and we&apos;ll open WhatsApp with your message pre-filled.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <FloatingInput label="Your Name" name="name" value={form.name} onChange={handleChange} required />
                  <FloatingInput label="Phone Number" name="phone" type="tel" value={form.phone} onChange={handleChange} required />

                  {/* Event type select */}
                  <div className="relative pt-5">
                    <label className="absolute top-0 left-0 font-cinzel text-[0.6rem] tracking-wider uppercase text-primary">
                      Event Type
                    </label>
                    <select
                      name="service"
                      value={form.service}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b-2 border-primary/20 focus:border-primary pb-2 pt-3 font-dm text-light text-sm focus:outline-none transition-colors appearance-none"
                    >
                      <option value="">Select event type...</option>
                      {serviceOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  {/* Event date */}
                  <div className="relative pt-5">
                    <label className="absolute top-0 left-0 font-cinzel text-[0.6rem] tracking-wider uppercase text-primary">
                      Event Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b-2 border-primary/20 focus:border-primary pb-2 pt-3 font-dm text-light text-sm focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Message */}
                  <div className="relative pt-5">
                    <label className="absolute top-0 left-0 font-cinzel text-[0.6rem] tracking-wider uppercase text-primary">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Tell us about your event..."
                      className="w-full bg-transparent border-b-2 border-primary/20 focus:border-primary pb-2 pt-3 font-dm text-light text-sm placeholder:text-text-muted/40 focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  {/* Submit button with success state */}
                  <AnimatePresence mode="wait">
                    {submitted ? (
                      <motion.div
                        key="success"
                        initial={reduced ? false : { scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 350, damping: 22 }}
                        className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-[#25D366] text-white font-dm font-semibold rounded-full min-h-[44px]"
                      >
                        <CheckCircle size={18} /> Sent! We&apos;ll reply soon
                      </motion.div>
                    ) : (
                      <motion.button
                        key="submit"
                        type="submit"
                        whileHover={reduced ? {} : { scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        className="btn-whatsapp w-full justify-center text-base"
                      >
                        <MessageCircle size={18} /> Send via WhatsApp
                      </motion.button>
                    )}
                  </AnimatePresence>

                  <p className="font-dm text-text-muted text-xs text-center">We&apos;ll get back to you within 2 hours!</p>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map — fade in */}
      <section className="pb-20 px-4 bg-dark">
        <div className="container-max">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 30, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card rounded-2xl overflow-hidden border border-primary/20"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-primary/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center">
                  <MapPin size={16} className="text-primary" />
                </div>
                <div>
                  <p className="font-cinzel text-xs text-primary uppercase tracking-widest">Find Us</p>
                  <p className="font-dm text-light text-sm">23rd Main Rd, JC Nagar, Nandini Layout, Bengaluru</p>
                </div>
              </div>
              <a
                href="https://www.google.com/maps/place/Virtual+Events+and+decorations,+%2320%2F15,+23rd+Main+Rd,+JC+Nagar,+Kurubarahalli,+Nandini+Layout,+Bengaluru,+Karnataka+560086"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white font-cinzel text-xs uppercase tracking-wider hover:bg-primary/90 transition-all"
              >
                <MapPin size={13} /> Get Directions
              </a>
            </div>
            <div className="relative w-full h-[400px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.3!2d77.5303386!3d13.0123559!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3de6d16c5b93%3A0x57209a40c18bc166!2sVirtual%20Events%20and%20decorations!5e0!3m2!1sen!2sin!4v1"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Virtual Events and Decorations Location"
              />
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
