"use client";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, MessageCircle, Phone, ArrowRight, CalendarCheck } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { buildServiceEnquiryURL } from "@/lib/whatsapp";
import type { Service, ServicePackage, ServiceSummary } from "@/lib/api";
import BookingModal from "./BookingModal";

interface Props {
  service: Service;
  related: ServiceSummary[];
}

export default function ServiceAnimatedBody({ service, related }: Props) {
  const reduced = useReducedMotion();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState<ServicePackage | null>(null);

  function openBooking(pkg?: ServicePackage) {
    setSelectedPkg(pkg ?? null);
    setModalOpen(true);
  }

  return (
    <>
      <div className="section-padding bg-dark">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Main content */}
            <div className="lg:col-span-2 space-y-10">

              {/* About */}
              <motion.div
                initial={reduced ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="font-playfair text-2xl font-bold text-primary mb-4">About This Service</h2>
                <p className="font-dm text-light/80 leading-relaxed">{service.longDesc}</p>
              </motion.div>

              {/* What's Included */}
              <motion.div
                initial={reduced ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h2 className="font-playfair text-2xl font-bold text-primary mb-4">What&apos;s Included</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {service.included.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={reduced ? false : { opacity: 0, x: -16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.06, duration: 0.35, ease: "easeOut" }}
                      className="flex items-center gap-3 glass-card rounded-xl p-3"
                    >
                      <motion.span
                        initial={reduced ? false : { scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.06 + 0.15, type: "spring", stiffness: 400, damping: 18 }}
                      >
                        <CheckCircle size={16} className="text-primary flex-shrink-0" />
                      </motion.span>
                      <span className="font-dm text-light/80 text-sm">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Packages */}
              <motion.div
                initial={reduced ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 }}
              >
                <h2 className="font-playfair text-2xl font-bold text-primary mb-4">Package Options</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {service.packages.map((pkg, i) => (
                    <motion.div
                      key={i}
                      initial={reduced ? false : { opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.12, duration: 0.45 }}
                      whileHover={i === 1 && !reduced ? { y: -6, scale: 1.02 } : {}}
                      className={`glass-card rounded-2xl p-5 relative flex flex-col ${i === 1 ? "border-primary/50 shadow-[0_8px_32px_rgba(0,166,147,0.18)]" : ""}`}
                    >
                      {i === 1 && (
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white font-cinzel text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                          Popular
                        </span>
                      )}
                      <h3 className="font-cormorant text-xl font-semibold text-primary mb-1">{pkg.name}</h3>
                      <p className="font-dm text-text-muted text-xs mb-3">{pkg.description}</p>
                      <ul className="space-y-2 mb-4 flex-1">
                        {pkg.items.map((item, j) => (
                          <li key={j} className="flex items-center gap-2 font-dm text-sm text-light/70">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                      {pkg.price != null ? (
                        <div className="space-y-2">
                          <div className="text-center py-2 px-4 rounded-full font-dm text-sm font-semibold text-primary border border-primary/30 bg-primary/5">
                            ₹{Number(pkg.price).toLocaleString("en-IN")}
                          </div>
                          <button
                            onClick={() => openBooking(pkg)}
                            className="w-full flex items-center justify-center gap-1.5 py-2 px-4 rounded-full font-cinzel text-[9px] tracking-[0.2em] uppercase transition-all hover:opacity-90 active:scale-95"
                            style={{ background: "#F1A805", color: "#020608" }}
                          >
                            <CalendarCheck size={12} /> Book This Package
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <a
                            href={buildServiceEnquiryURL(`${service.name} - ${pkg.name} Package`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-center py-2 px-4 border border-primary/40 text-primary rounded-full font-dm text-sm hover:bg-primary hover:text-white transition-all"
                          >
                            Call for Pricing
                          </a>
                          <button
                            onClick={() => openBooking(pkg)}
                            className="w-full flex items-center justify-center gap-1.5 py-2 px-4 rounded-full font-cinzel text-[9px] tracking-[0.2em] uppercase transition-all border"
                            style={{ borderColor: "#F1A80540", color: "#84572F" }}
                          >
                            <CalendarCheck size={12} /> Book Now
                          </button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Add-ons */}
              <motion.div
                initial={reduced ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="font-playfair text-2xl font-bold text-primary mb-4">Add-On Services</h2>
                <div className="flex flex-wrap gap-3">
                  {service.addons.map((addon, i) => (
                    <motion.span
                      key={i}
                      initial={reduced ? false : { opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05, type: "spring", stiffness: 350, damping: 22 }}
                      className="glass-card px-4 py-2 rounded-full font-cinzel text-xs text-primary uppercase tracking-wider hover:bg-primary hover:text-white transition-colors cursor-default"
                    >
                      {addon.name}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sticky sidebar */}
            <div>
              <motion.div
                initial={reduced ? false : { opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="glass-card rounded-2xl p-6 sticky top-28"
              >
                <h3 className="font-playfair text-xl font-bold text-primary mb-2">Ready to Book?</h3>
                <p className="font-dm text-text-muted text-sm mb-5">Secure your date now. We confirm within 2 hours!</p>
                <div className="space-y-3">
                 
                  <a href={buildServiceEnquiryURL(service.name)} target="_blank" rel="noopener noreferrer" className="btn-whatsapp w-full justify-center">
                    <MessageCircle size={18} /> WhatsApp Enquiry
                  </a>
                  <a href="tel:8884447579" className="btn-outline w-full justify-center">
                    <Phone size={18} /> Call Us
                  </a>
                </div>
                <p className="font-cinzel text-xs text-text-muted text-center mt-4 tracking-widest uppercase">Available 9 AM – 9 PM</p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Related services */}
      {related.length > 0 && (
        <section className="section-padding bg-dark-card">
          <div className="container-max">
            <motion.h2
              initial={reduced ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-playfair text-2xl font-bold text-primary mb-6"
            >
              Related Services
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((s, i) => (
                <motion.div
                  key={s.id}
                  initial={reduced ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.45 }}
                  whileHover={reduced ? {} : { y: -5 }}
                >
                  <Link href={`/services/${s.slug}`} className="group glass-card rounded-2xl overflow-hidden block transition-all duration-300 hover:border-primary/40">
                    <div className="relative aspect-video overflow-hidden">
                      <Image src={s.image} alt={s.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="33vw" loading="lazy" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-cormorant text-lg font-semibold text-light group-hover:text-primary transition-colors">{s.name}</h3>
                      <span className="inline-flex items-center gap-1 text-primary text-sm mt-2">
                        View Details <ArrowRight size={12} />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Booking modal */}
      <AnimatePresence>
        {modalOpen && (
          <BookingModal
            service={service}
            preSelectedPackage={selectedPkg}
            onClose={() => setModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
