'use client'

import { FeatureCard } from './feature-card'
import { Map, Calculator, FileCheck, ClipboardList, Wallet, BarChart3 } from 'lucide-react'

const features = [
  {
    icon: Map,
    title: 'Kalkulasi Otomatis',
    description:
      'Tidak perlu hitung manual. Jarak antara kota dihitung otomatis menggunakan formula Haversine yang akurat.',
  },
  {
    icon: Wallet,
    title: 'Perhitungan Uang Saku',
    description:
      'Otomatisasi nominal uang saku berdasarkan zona jarak dan durasi perjalanan sesuai peraturan perusahaan.',
  },
  {
    icon: FileCheck,
    title: 'Approval Berjenjang',
    description:
      'Sistem persetujuan digital yang mudah. Notifikasi langsung ke atasan dan tim SDM untuk proses lebih cepat.',
  },
  {
    icon: ClipboardList,
    title: 'Tracking Status',
    description:
      'Pantau status pengajuan secara real-time. Dari submitted, approved, hingga perjalanan selesai.',
  },
  {
    icon: Calculator,
    title: 'Master Data Terpusat',
    description:
      'Kelola data kota, standar biaya, dan data pegawai dalam satu dashboard admin yang mudah digunakan.',
  },
  {
    icon: BarChart3,
    title: 'Laporan Komprehensif',
    description:
      'Dapatkan insight dari data perjalanan dinas untuk efisiensi anggaran dan perencanaan kedepan.',
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 lg:py-28 bg-slate-50 dark:bg-slate-900/50">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
            Fitur Unggulan
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
            Semua yang Anda butuhkan untuk manajemen perjalanan dinas yang efisien, akurat, dan transparan.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
