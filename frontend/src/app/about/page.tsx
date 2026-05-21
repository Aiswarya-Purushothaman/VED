"use client";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import CTABanner from "@/components/home/CTABanner";
import StatsBar from "@/components/home/StatsBar";

const team = [{ name: "Kiran Kumar", role: "Lead Decorator & Founder", img: "/founder.jpg" }];

const story = [
  "Virtual Events and Decorations was born from a simple belief — that every celebration deserves to be extraordinary. Founded over 8 years ago in Bengaluru, we started with a small team and a big dream: to transform ordinary spaces into magical experiences.",
  "Over the years, we've had the privilege of being part of thousands of special moments — first birthdays, dream weddings, corporate milestones, and intimate proposals. Each event has taught us something new and deepened our passion for what we do.",
  "Today, we're proud to be Bengaluru's trusted decoration partner with a 5-star rating and a growing family of happy clients who keep coming back — because we don't just decorate spaces, we create memories.",
];

export default function AboutPage() {
  const reduced = useReducedMotion();

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4 bg-dark-card overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container-max relative z-10 text-center">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-cinzel text-xs tracking-[0.3em] text-primary uppercase">Our Story</span>
            <h1 className="section-heading mt-2">
              About{" "}
              <em className="font-cormorant not-italic text-gradient-gold">Virtual Events</em>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Story section */}
      <section className="section-padding bg-dark">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Image with Ken Burns */}
            <motion.div
              initial={reduced ? false : { opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden"
            >
              <motion.div
                className="absolute inset-0"
                animate={reduced ? {} : { scale: [1, 1.05, 1] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&q=80"
                  alt="Our Story"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  loading="lazy"
                />
              </motion.div>
              {/* Soft vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            </motion.div>

            {/* Story text — paragraph-by-paragraph reveal */}
            <div className="space-y-5">
              <motion.h2
                initial={reduced ? false : { opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55 }}
                className="font-playfair text-3xl font-bold text-primary"
              >
                Our Story
              </motion.h2>
              {story.map((para, i) => (
                <motion.p
                  key={i}
                  initial={reduced ? false : { opacity: 0, y: 20, filter: "blur(4px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  className="font-dm text-light/80 leading-relaxed"
                >
                  {para}
                </motion.p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission / Vision — flip-reveal cards */}
      <section className="section-padding bg-dark-mid">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { icon: "🎯", title: "Our Mission", text: "To make premium event decoration accessible to everyone — delivering breathtaking setups that exceed expectations, within budget, every time." },
              { icon: "✨", title: "Our Vision",  text: "To be the most loved decoration service in India — known for creativity, reliability, and the ability to turn any moment into an unforgettable memory." },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={reduced ? false : { opacity: 0, rotateY: 90 }}
                whileInView={{ opacity: 1, rotateY: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: i * 0.2, duration: 0.65, ease: "easeOut" }}
                style={{ perspective: 1000 }}
                className="glass-card rounded-2xl p-8"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-playfair text-2xl font-bold text-primary mb-3">{item.title}</h3>
                <p className="font-dm text-text-muted leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding bg-dark">
        <div className="container-max">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 30, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="font-cinzel text-xs tracking-[0.3em] text-primary uppercase">The Team</span>
            <h2 className="section-heading mt-2">
              Meet Our{" "}
              <em className="font-cormorant not-italic text-gradient-gold">Team</em>
            </h2>
          </motion.div>

          <div className="flex justify-center">
            {team.map((member, i) => (
              <motion.div
                key={i}
                initial={reduced ? false : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center"
              >
                {/* Ken Burns on founder photo */}
                <div className="relative w-48 h-48 rounded-full overflow-hidden mx-auto mb-5 border-2 border-primary/50 shadow-lg shadow-primary/20">
                  <motion.div
                    className="absolute inset-0"
                    animate={reduced ? {} : { scale: [1, 1.06, 1] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Image src={member.img} alt={member.name} fill className="object-cover object-top" sizes="192px" loading="lazy" />
                  </motion.div>
                </div>
                <h3 className="font-cormorant text-2xl font-semibold text-light">{member.name}</h3>
                <p className="font-cinzel text-xs text-primary uppercase tracking-wider mt-1">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements — reuse StatsBar */}
      <StatsBar />

      <CTABanner />
    </>
  );
}
