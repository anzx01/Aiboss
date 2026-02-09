import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary"></div>
            <span className="text-xl font-semibold font-display text-gray-dark">
              AI Boss
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm font-medium font-display text-gray-dark hover:text-primary transition-colors"
            >
              首页
            </Link>
            <Link
              href="/#agents"
              className="text-sm font-display text-gray-secondary hover:text-gray-dark transition-colors"
            >
              数字员工
            </Link>
            <Link
              href="/#pricing"
              className="text-sm font-display text-gray-secondary hover:text-gray-dark transition-colors"
            >
              定价
            </Link>
          </nav>

          {/* Login Button */}
          <button className="px-5 py-2.5 border border-gray-border text-sm font-medium font-display text-gray-dark hover:border-gray-dark transition-colors">
            登录
          </button>
        </div>
      </div>
    </header>
  );
}
