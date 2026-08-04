import { TopBar } from '@/components/news/top-bar'
import { Header } from '@/components/news/header'
import { Footer } from '@/components/news/footer'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Mail, MapPin, Phone, Send } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className='flex min-h-screen flex-col bg-background'>
      <TopBar />
      <Header />

      <main className='flex-1 container mx-auto px-4 py-8 max-w-6xl'>
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">প্রচ্ছদ</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>যোগাযোগ</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="text-4xl font-bold font-serif-bn mb-8 text-brand">আমাদের সাথে যোগাযোগ করুন</h1>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4 font-serif-bn">যোগাযোগের তথ্য</h2>
              <p className="text-muted-foreground mb-6">
                আপনার যেকোনো মতামত, অভিযোগ বা বিজ্ঞাপনের জন্য আমাদের সাথে সরাসরি যোগাযোগ করতে পারেন।
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-brand/10 p-3 rounded-full text-brand">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold">ঠিকানা</h3>
                  <p className="text-muted-foreground text-sm">১২৩ মিডিয়া কমপ্লেক্স, কারওয়ান বাজার, ঢাকা-১২১৫</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-brand/10 p-3 rounded-full text-brand">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold">ফোন</h3>
                  <p className="text-muted-foreground text-sm">+৮৮ ০২ ৯৮৮৭৭৬৬</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-brand/10 p-3 rounded-full text-brand">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold">ইমেইল</h3>
                  <p className="text-muted-foreground text-sm">info@barta.news</p>
                </div>
              </div>
            </div>

            {/* Google Map Placeholder */}
            <div className="w-full h-64 bg-secondary rounded-xl overflow-hidden relative">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.1234567890123!2d90.3928123!3d23.7508678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8971f4961d1%3A0x4a457497d391f692!2sKawran%20Bazar%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-card border rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-6 font-serif-bn">বার্তা পাঠান</h2>
              <form className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">নাম</Label>
                    <Input id="first-name" placeholder="আপনার পুরো নাম" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">ইমেইল</Label>
                    <Input id="email" type="email" placeholder="আপনার ইমেইল ঠিকানা" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">বিষয়</Label>
                  <Input id="subject" placeholder="কি বিষয়ে যোগাযোগ করতে চান" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">বার্তা</Label>
                  <Textarea id="message" placeholder="আপনার বার্তা বিস্তারিত লিখুন..." className="min-h-[150px]" />
                </div>
                <Button className="w-full sm:w-auto bg-brand hover:bg-brand/90 text-white px-8">
                  <Send className="w-4 h-4 mr-2" />
                  বার্তা পাঠান
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
