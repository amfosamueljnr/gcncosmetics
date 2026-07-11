const phoneNumber = "233274654976";
const message = "Hello GCN Cosmetics, I would like to make an enquiry.";

export default function FloatingWhatsApp() {
  const href = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with GCN Cosmetics on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 md:bottom-6 md:right-6 md:h-16 md:w-16"
    >
      <svg
        viewBox="0 0 32 32"
        aria-hidden="true"
        className="h-8 w-8 md:h-9 md:w-9"
        fill="currentColor"
      >
        <path d="M16.01 3.2c-7.04 0-12.76 5.7-12.76 12.72 0 2.4.67 4.73 1.95 6.75L3.12 28.8l6.36-2.03a12.7 12.7 0 0 0 6.53 1.8c7.04 0 12.76-5.7 12.76-12.73S23.05 3.2 16.01 3.2Zm0 23.2c-2.14 0-4.22-.64-5.99-1.85l-.43-.29-3.53 1.13 1.15-3.39-.3-.45a10.4 10.4 0 0 1-1.5-5.63c0-5.83 4.75-10.56 10.6-10.56s10.6 4.73 10.6 10.56-4.75 10.48-10.6 10.48Zm5.8-7.87c-.32-.16-1.9-.94-2.2-1.04-.29-.1-.5-.16-.71.16-.21.31-.82 1.04-1 1.25-.19.21-.37.23-.69.08-.32-.16-1.34-.49-2.55-1.56-.94-.84-1.58-1.88-1.76-2.2-.18-.31-.02-.48.14-.64.14-.14.32-.37.48-.55.16-.18.21-.31.32-.52.11-.21.05-.39-.03-.55-.08-.16-.71-1.7-.98-2.33-.26-.61-.52-.53-.71-.54h-.61c-.21 0-.55.08-.84.39-.29.31-1.1 1.07-1.1 2.62s1.13 3.04 1.29 3.25c.16.21 2.23 3.39 5.4 4.75.75.32 1.34.52 1.8.66.76.24 1.45.21 1.99.13.61-.09 1.9-.78 2.17-1.53.27-.75.27-1.39.19-1.53-.08-.13-.29-.21-.61-.37Z" />
      </svg>
    </a>
  );
}
