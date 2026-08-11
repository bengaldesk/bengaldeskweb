import { TopBar } from '@/components/news/top-bar'
import { Header } from '@/components/news/header'
import { Footer } from '@/components/news/footer'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'

export default function PrivacyPage() {
  return (
    <div className='flex min-h-screen flex-col bg-background'>
      <TopBar />
      <Header />

      <main className='flex-1 container mx-auto px-4 py-8 max-w-4xl'>
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">প্রচ্ছদ</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>গোপনীয়তা নীতি</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <article className="max-w-none space-y-6 text-text-secondary leading-relaxed">
          <h1 className="text-3xl font-bold font-display mb-6">গোপনীয়তা নীতি (Privacy Policy)</h1>
          <p className="text-muted-foreground mb-6">সর্বশেষ আপডেট: ৪ আগস্ট, ২০২৪</p>
          
          <p>
            The Bengal Desk নিউজ পোর্টালে আপনার গোপনীয়তা রক্ষা করা আমাদের কাছে অত্যন্ত গুরুত্বপূর্ণ। এই গোপনীয়তা নীতি আমাদের পাঠকদের তথ্যের সুরক্ষা এবং আমরা কীভাবে সেই তথ্য ব্যবহার করি সে সম্পর্কে বিস্তারিত ধারণা প্রদান করে।
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">১. আমরা কী ধরণের তথ্য সংগ্রহ করি?</h2>
          <p>
            আমরা সাধারণত দুই ধরণের তথ্য সংগ্রহ করি:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>ব্যক্তিগত তথ্য:</strong> যখন আপনি আমাদের নিউজলেটারে সাবস্ক্রাইব করেন বা আমাদের সাথে যোগাযোগ করেন, তখন আমরা আপনার নাম, ইমেইল ঠিকানা ইত্যাদি সংগ্রহ করি।</li>
            <li><strong>অ-ব্যক্তিগত তথ্য:</strong> আপনার আইপি ঠিকানা, ব্রাউজার ধরণ, ডিভাইসের ধরণ এবং আমাদের সাইটে আপনার কার্যক্রম সম্পর্কিত তথ্য কুকিজের মাধ্যমে সংগ্রহ করা হয়।</li>
          </ul>

          <h2 className="text-xl font-bold mt-8 mb-4">২. তথ্যের ব্যবহার</h2>
          <p>
            আপনার কাছ থেকে সংগৃহীত তথ্য আমরা নিম্নোক্ত কাজে ব্যবহার করি:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>আমাদের সেবা উন্নত করা এবং পাঠকদের চাহিদামত সংবাদ প্রদান করা।</li>
            <li>আপনাকে সর্বশেষ সংবাদের নোটিফিকেশন বা নিউজলেটার পাঠানো (যদি আপনি অনুমতি দেন)।</li>
            <li>ওয়েবসাইটের নিরাপত্তা নিশ্চিত করা এবং প্রযুক্তিগত সমস্যা সমাধান করা।</li>
          </ul>

          <h2 className="text-xl font-bold mt-8 mb-4">৩. তথ্য শেয়ারিং</h2>
          <p>
            আমরা আপনার ব্যক্তিগত তথ্য কোনো তৃতীয় পক্ষের কাছে বিক্রি বা ভাড়ায় দেই না। তবে আইনগত প্রয়োজনে বা আমাদের সেবা প্রদানের স্বার্থে বিশ্বস্ত সহযোগী প্রতিষ্ঠানের সাথে সীমিত তথ্য শেয়ার করতে পারি।
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">৪. নিরাপত্তা</h2>
          <p>
            আপনার তথ্যের সুরক্ষা নিশ্চিত করতে আমরা আধুনিক নিরাপত্তা ব্যবস্থা ব্যবহার করি। তবে ইন্টারনেটে তথ্য আদান-প্রদান ১০০% নিরাপদ এমন গ্যারান্টি দেওয়া সম্ভব নয়।
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">৫. পরিবর্তনের অধিকার</h2>
          <p>
            The Bengal Desk কর্তৃপক্ষ যেকোনো সময় এই গোপনীয়তা নীতি পরিবর্তন বা পরিমার্জন করার অধিকার রাখে। যেকোনো পরিবর্তন এই পৃষ্ঠায় জানানো হবে।
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">যোগাযোগ</h2>
          <p>
            গোপনীয়তা নীতি সম্পর্কে আপনার কোনো প্রশ্ন থাকলে আমাদের ইমেইল করুন: <a href="mailto:privacy@bengaldesk.com" className="text-brand hover:underline">privacy@bengaldesk.com</a>
          </p>
        </article>
      </main>

      <Footer />
    </div>
  )
}
