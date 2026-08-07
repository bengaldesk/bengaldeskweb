import { TopBar } from '@/components/news/top-bar'
import { Header } from '@/components/news/header'
import { Footer } from '@/components/news/footer'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Card, CardContent } from '@/components/ui/card'
import { Mail, MapPin, Phone } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className='flex min-h-screen flex-col bg-background'>
      <TopBar />
      <Header />

      <main className='flex-1 container mx-auto px-4 py-8 max-w-5xl'>
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">প্রচ্ছদ</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>আমাদের সম্পর্কে</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <section className="mb-12">
          <h1 className="text-4xl font-bold font-display mb-6 text-brand">আমাদের সম্পর্কে</h1>
          <div className="max-w-none text-text-secondary leading-relaxed space-y-4">
            <p className="mb-4">
              বার্তা একটি আধুনিক ও গতিশীল বাংলা নিউজ পোর্টাল। আমরা বাংলাদেশ ও বিশ্বের সর্বশেষ সংবাদ, গভীর বিশ্লেষণ এবং নিরপেক্ষ দৃষ্টিভঙ্গি নিয়ে পাঠকদের সামনে হাজির হই। সত্যের পথে অবিচল থেকে বস্তুনিষ্ঠ সাংবাদিকতা আমাদের মূল লক্ষ্য।
            </p>
            <p className="mb-4">
              ২০২৪ সালে যাত্রা শুরু করা বার্তা নিউজ খুব অল্প সময়েই পাঠকদের বিশ্বস্ততা অর্জন করতে সক্ষম হয়েছে। রাজনীতি, অর্থনীতি, আন্তর্জাতিক, খেলাধুলা, বিনোদন, প্রযুক্তি এবং লাইফস্টাইল সহ সব ধরণের সংবাদ আমরা দ্রুত এবং নির্ভুলভাবে পৌঁছে দেই।
            </p>
          </div>
        </section>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold font-display mb-4">আমাদের লক্ষ্য</h2>
              <p className="text-muted-foreground">
                আমাদের লক্ষ্য হলো একটি তথ্যনির্ভর সমাজ গড়ে তোলা যেখানে নাগরিকরা সঠিক সংবাদ ও বিশ্লেষণের মাধ্যমে সচেতন সিদ্ধান্ত নিতে পারে। আমরা সংবাদ পরিবেশনে সততা, নির্ভুলতা এবং নিরপেক্ষতাকে সর্বোচ্চ গুরুত্ব দেই।
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold font-display mb-4">আমাদের দর্শন</h2>
              <p className="text-muted-foreground">
                আমরা বিশ্বাস করি, একটি স্বাধীন ও শক্তিশালী গণমাধ্যম গণতন্ত্রের মূল ভিত্তি। বার্তা নিউজ কোনো রাজনৈতিক বা গোষ্ঠীগত স্বার্থের ঊর্ধ্বে থেকে শুধুমাত্র জনস্বার্থে কাজ করে।
              </p>
            </CardContent>
          </Card>
        </div>

        <section className="bg-secondary/30 rounded-xl p-8 mb-12">
          <h2 className="text-3xl font-bold font-display mb-6 text-center">কেন আমরা অনন্য?</h2>
          <div className="grid sm:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-brand font-bold text-4xl mb-2">২৪/৭</div>
              <p className="font-medium">সরাসরি সংবাদ আপডেট</p>
            </div>
            <div>
              <div className="text-brand font-bold text-4xl mb-2">১০০%</div>
              <p className="font-medium">বস্তুনিষ্ঠ ও সত্যনিষ্ঠ</p>
            </div>
            <div>
              <div className="text-brand font-bold text-4xl mb-2">৫০+</div>
              <p className="font-medium">দক্ষ সাংবাদিক ও কর্মী</p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold font-display mb-6">আমাদের সাথে যোগাযোগ করুন</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4 p-4 border rounded-lg">
              <MapPin className="text-brand w-6 h-6 shrink-0" />
              <div>
                <h3 className="font-bold mb-1">ঠিকানা</h3>
                <p className="text-sm text-muted-foreground">১২৩ মিডিয়া কমপ্লেক্স, কারওয়ান বাজার, ঢাকা-১২১৫</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 border rounded-lg">
              <Phone className="text-brand w-6 h-6 shrink-0" />
              <div>
                <h3 className="font-bold mb-1">ফোন</h3>
                <p className="text-sm text-muted-foreground">+৮৮ ০২ ৯৮৮৭৭৬৬</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 border rounded-lg">
              <Mail className="text-brand w-6 h-6 shrink-0" />
              <div>
                <h3 className="font-bold mb-1">ইমেইল</h3>
                <p className="text-sm text-muted-foreground">info@barta.news</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
