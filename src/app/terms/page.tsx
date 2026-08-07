import { TopBar } from '@/components/news/top-bar'
import { Header } from '@/components/news/header'
import { Footer } from '@/components/news/footer'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'

export default function TermsPage() {
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
              <BreadcrumbPage>ব্যবহারের শর্তাবলী</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <article className="prose prose-slate dark:prose-invert max-w-none">
          <h1 className="text-3xl font-bold font-display mb-6">ব্যবহারের শর্তাবলী (Terms of Service)</h1>
          <p className="text-muted-foreground mb-6">সর্বশেষ আপডেট: ৪ আগস্ট, ২০২৪</p>

          <p>
            বার্তা নিউজ পোর্টালে আপনাকে স্বাগতম। এই ওয়েবসাইট ব্যবহার করার মাধ্যমে আপনি নিম্নলিখিত শর্তাবলী মেনে নিতে সম্মত হচ্ছেন। অনুগ্রহ করে শর্তগুলো মনোযোগ সহকারে পড়ুন।
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">১. বৌদ্ধিক সম্পত্তি (Intellectual Property)</h2>
          <p>
            বার্তায় প্রকাশিত সমস্ত সংবাদ, ছবি, ভিডিও, লোগো এবং ডিজাইন বার্তা কর্তৃপক্ষের নিজস্ব সম্পত্তি অথবা যথাযথ অনুমতি সাপেক্ষে ব্যবহৃত। আমাদের লিখিত অনুমতি ছাড়া কোনো বিষয়বস্তু বাণিজ্যিক উদ্দেশ্যে কপি, পুনরুৎপাদন বা বিতরণ করা আইনত দণ্ডনীয়।
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">২. ব্যবহারের নিয়মাবলী</h2>
          <p>
            পাঠক হিসেবে আপনি আমাদের ওয়েবসাইটের তথ্য শুধুমাত্র ব্যক্তিগত ও অবাণিজ্যিক উদ্দেশ্যে ব্যবহার করতে পারবেন। সাইটে মন্তব্য করার সময় অশ্লীল, মানহানিকর বা উস্কানিমূলক ভাষা ব্যবহার থেকে বিরত থাকতে হবে।
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">৩. দায়মুক্তি (Disclaimer)</h2>
          <p>
            আমরা সবসময় সঠিক তথ্য প্রদানের চেষ্টা করি, তবে তথ্যের সম্পূর্ণ নির্ভুলতা বা সাময়িক ত্রুটির জন্য বার্তা কর্তৃপক্ষ দায়ী থাকবে না। সাইটের কোনো লিঙ্কের মাধ্যমে অন্য কোনো থার্ড-পার্টি ওয়েবসাইটে গেলে তার বিষয়বস্তুর জন্য আমরা দায়ী নই।
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">৪. সেবা পরিবর্তন</h2>
          <p>
            বার্তা কর্তৃপক্ষ যেকোনো সময় পূর্ব ঘোষণা ছাড়াই ওয়েবসাইটের কোনো অংশ পরিবর্তন, পরিবর্ধন বা বন্ধ করার অধিকার রাখে।
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">৫. আইনগত ব্যবস্থা</h2>
          <p>
            এই শর্তাবলী বাংলাদেশের প্রচলিত আইন অনুযায়ী পরিচালিত হবে। কোনো বিবাদ দেখা দিলে তা ঢাকা আদালতের এখতিয়ারে মীমাংসিত হবে।
          </p>

          <p className="mt-8 italic">
            আমাদের সেবা ব্যবহার করার জন্য আপনাকে ধন্যবাদ। কোনো জিজ্ঞাসা থাকলে আমাদের সাথে <a href="/contact" className="text-brand hover:underline">যোগাযোগ করুন</a>।
          </p>
        </article>
      </main>

      <Footer />
    </div>
  )
}
