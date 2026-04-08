import { PhoneCall } from 'lucide-react';

export default function TopBar() {
  return (
    <header className="fixed top-0 left-0 w-full flex justify-between items-center px-6 py-4 max-w-7xl mx-auto bg-[#fafaf5]/80 backdrop-blur-3xl z-50 shadow-[0_40px_64px_rgba(26,28,25,0.04)]">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/10">
          <img 
            alt="Profile" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpaWX2q9Ywih88gVWMU-lnMpge2cclL2Ms3VGV36vli1MlBmFmbTCvdYAZkZ3HEAjAXS5mwJl4203pr32aeNpfV9E-_LKpUrhOQoo2qIqGQXIjBNpuD0plGADYGCHnSRyVsWMTUdgWQf_CWmV9N4wbbRIaX2l3u_HYenEODndDP-3zrdiNUahhmlAWfT6LJSq4roEZFiL2kLGSNVbiGj3RY0zm7r9ueCBkRuyBTdjw-ZuwcJ_IaIo6DflkSmIQC7pTKym3eg4hC48"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <span className="text-2xl font-bold bg-gradient-to-br from-[#005228] to-[#006d37] bg-clip-text text-transparent tracking-tight">
          颐护家
        </span>
      </div>
      <button className="w-12 h-12 rounded-full flex items-center justify-center text-[#006D37] hover:opacity-80 transition-opacity active:scale-95 duration-200">
        <PhoneCall size={24} />
      </button>
    </header>
  );
}
