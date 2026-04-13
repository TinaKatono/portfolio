import { FormEvent, useState } from "react";
import { BrandSerif } from "../components/brand";
import { SiteCenterBrand } from "../components/SiteCenterBrand";
import { SiteHeader } from "../components/SiteHeader";
import { CONTACT_EMAIL } from "../data/contact";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const subject = "【Portfolio】お問い合わせ";
    const body = [
      `お名前 / Name: ${name}`,
      `返信先メール / Reply-to: ${email}`,
      "",
      "— メッセージ / Message —",
      "",
      message,
    ].join("\n");
    const href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
  };

  return (
    <div className="relative mx-auto flex min-h-screen w-full flex-col items-start bg-[#f5f7f8]">
      <SiteCenterBrand />
      <SiteHeader />

      <main className="w-full shrink-0 border-t border-[#b0bec5] px-10 pb-20 pt-[120px]">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-12">
          <header className="flex flex-col gap-6">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="whitespace-nowrap font-sans text-[40px] leading-none text-[#333]">GET IN</span>
              <BrandSerif>
                <span className="whitespace-nowrap text-[40px] leading-none text-[#333]">TOUCH</span>
              </BrandSerif>
            </div>
            {/* <div className="flex flex-col gap-6 text-[#333]">
              <p className="font-jp text-[16px] font-medium leading-[1.8] tracking-[0.08em]">
                ご依頼やご質問があれば、以下のフォームからお送りください。送信ボタンを押すと、あなたのメールアプリが開き、内容が転記されます。
              </p>
              <p className="font-sans text-[14px] leading-[1.5] tracking-[0.08em]">
                For project inquiries or questions, use the form below. Submitting opens your mail app with the
                message pre-filled.
              </p>
            </div> */}
          </header>

          <form onSubmit={onSubmit} className="flex flex-col gap-8" noValidate>
            <div className="flex flex-col gap-2.5">
              <label htmlFor="contact-name" className="font-sans text-[16px] leading-none text-[#333]">
                NAME
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-[#b0bec5] bg-white px-4 py-3 font-sans text-[14px] leading-[1.5] tracking-[0.04em] text-[#333] outline-none transition-[box-shadow] placeholder:text-[#90a4ae] focus-visible:ring-2 focus-visible:ring-[#333]/20"
                placeholder="Your name"
              />
            </div>

            <div className="flex flex-col gap-2.5">
              <label htmlFor="contact-email" className="font-sans text-[16px] leading-none text-[#333]">
                EMAIL
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-[#b0bec5] bg-white px-4 py-3 font-sans text-[14px] leading-[1.5] tracking-[0.04em] text-[#333] outline-none transition-[box-shadow] placeholder:text-[#90a4ae] focus-visible:ring-2 focus-visible:ring-[#333]/20"
                placeholder="you@example.com"
              />
            </div>

            <div className="flex flex-col gap-2.5">
              <label htmlFor="contact-message" className="font-sans text-[16px] leading-none text-[#333]">
                MESSAGE
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={8}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[12rem] w-full resize-y border border-[#b0bec5] bg-white px-4 py-3 font-jp text-[15px] font-medium leading-[1.8] tracking-[0.06em] text-[#333] outline-none transition-[box-shadow] placeholder:text-[#90a4ae] focus-visible:ring-2 focus-visible:ring-[#333]/20"
                placeholder="お問い合わせ内容をご記入ください。"
              />
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-2">
              <button
                type="submit"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-black bg-transparent px-12 font-sans text-[14px] font-normal uppercase tracking-[0.12em] text-[#333] transition-colors duration-200 ease-out hover:bg-[#333] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#333] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5f7f8] motion-reduce:transition-none"
              >
                Send
              </button>
              {/* <Link
                to="/"
                className="font-sans text-[14px] leading-none tracking-[0.08em] text-[#333] underline underline-offset-4 transition-opacity hover:opacity-70"
              >
                Back to top
              </Link> */}
            </div>
          </form>
        </div>
      </main>

      <footer className="relative z-10 mt-auto flex w-full flex-col items-start overflow-hidden bg-[#f5f7f8] pb-10">
        <div className="flex w-full items-start gap-40 border-t border-[#cfd8dc] pt-10">
          <div className="flex w-full items-start px-10">
            <div className="flex h-10 w-full items-start">
              <div className="flex flex-col items-start gap-60">
                <div className="flex items-baseline gap-2">
                  <span className="whitespace-nowrap text-center font-sans text-[40px] leading-none tracking-[-0.03em] text-[#333]">
                    TINA
                  </span>
                  <BrandSerif>
                    <span className="whitespace-nowrap text-[40px] leading-none text-[#333]">KATONO</span>
                  </BrandSerif>
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col items-end justify-end">
              <p className="whitespace-nowrap font-jp text-xl leading-[1.6] text-[#333]">© 2026 Tina Katono</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
