import { TopBar } from '@/components/news/top-bar'
import { Header } from '@/components/news/header'
import { Footer } from '@/components/news/footer'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'

export default function CookiesPage() {
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
              <BreadcrumbPage>কুকিজ নীতি</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <article className="max-w-none space-y-6 text-text-secondary leading-relaxed">
          <h1 className="text-3xl font-bold font-display mb-6">কুকিজ নীতি (Cookies Policy)</h1>
          <p className="text-muted-foreground mb-6">সর্বশেষ আপডেট: ৪ আগস্ট, ২০২৪</p>

          <p>
            বার্তা নিউজ পোর্টালে আপনার অভিজ্ঞতা উন্নত করতে আমরা 'কুকিজ' ব্যবহার করি। এই নীতিমালায় কুকিজ কী, আমরা কেন এটি ব্যবহার করি এবং আপনি কীভাবে এটি নিয়ন্ত্রণ করতে পারেন তা ব্যাখ্যা করা হয়েছে।
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">১. কুকিজ কী?</h2>
          <p>
            কুকিজ হলো ছোট টেক্সট ফাইল যা আপনার ব্রাউজারে সংরক্ষিত থাকে যখন আপনি কোনো ওয়েবসাইট ভিজিট করেন। এটি ওয়েবসাইটকে আপনার পছন্দ এবং কার্যক্রম মনে রাখতে সাহায্য করে।
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">২. আমরা কেন কুকিজ ব্যবহার করি?</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>প্রয়োজনীয় কুকিজ:</strong> ওয়েবসাইটের মূল কার্যাবলী সচল রাখতে এগুলো অপরিহার্য।</li>
            <li><strong>অ্যানালিটিক্স কুকিজ:</strong> পাঠকরা কীভাবে আমাদের সাইট ব্যবহার করছেন তা বুঝতে এবং সেবার মান উন্নত করতে আমরা গুগল অ্যানালিটিক্সের মতো টুল ব্যবহার করি।</li>
            <li><strong>পছন্দ সংক্রান্ত কুকিজ:</strong> আপনার পছন্দের ভাষা বা থিম (ডার্ক/লাইট মোড) মনে রাখতে এগুলো ব্যবহৃত হয়।</li>
            <li><strong>বিজ্ঞাপন কুকিজ:</strong> আপনাকে প্রাসঙ্গিক বিজ্ঞাপন দেখানোর জন্য তৃতীয় পক্ষের বিজ্ঞাপনদাতারা কুকিজ ব্যবহার করতে পারে।</li>
          </ul>

          <h2 className="text-xl font-bold mt-8 mb-4">৩. আপনার নিয়ন্ত্রণ</h2>
          <p>
            আপনি চাইলে আপনার ব্রাউজার সেটিংস থেকে কুকিজ বন্ধ বা ডিলেট করতে পারেন। তবে কুকিজ বন্ধ করলে ওয়েবসাইটের কিছু সুবিধা সঠিকভাবে কাজ নাও করতে পারে।
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">৪. তৃতীয় পক্ষের কুকিজ</h2>
          <p>
            আমাদের সাইটে ফেসবুক, টুইটার বা ইউটিউবের মতো সামাজিক যোগাযোগ মাধ্যমের লিঙ্ক বা কন্টেন্ট থাকতে পারে, যারা নিজস্ব কুকিজ ব্যবহার করতে পারে।
          </p>

          <p className="mt-8">
            কুকিজ নীতি সম্পর্কে আরও জানতে আমাদের সাথে যোগাযোগ করুন।
          </p>
        </article>
      </main>

      <Footer />
    </div>
  )
}
