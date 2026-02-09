import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-dark text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-12">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-primary"></div>
              <span className="text-lg font-semibold font-display">AI Boss</span>
            </div>
            <p className="text-sm text-gray-secondary max-w-[200px]">
              像雇人一样雇 AI 干活
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-16">
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold font-display">产品</h3>
              <Link href="/#agents" className="text-sm text-gray-secondary hover:text-white transition-colors">
                数字员工
              </Link>
              <Link href="/#pricing" className="text-sm text-gray-secondary hover:text-white transition-colors">
                定价
              </Link>
              <Link href="/#features" className="text-sm text-gray-secondary hover:text-white transition-colors">
                使用案例
              </Link>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold font-display">公司</h3>
              <Link href="/about" className="text-sm text-gray-secondary hover:text-white transition-colors">
                关于我们
              </Link>
              <Link href="/blog" className="text-sm text-gray-secondary hover:text-white transition-colors">
                博客
              </Link>
              <Link href="/contact" className="text-sm text-gray-secondary hover:text-white transition-colors">
                联系我们
              </Link>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold font-display">法律</h3>
              <Link href="/privacy" className="text-sm text-gray-secondary hover:text-white transition-colors">
                隐私政策
              </Link>
              <Link href="/terms" className="text-sm text-gray-secondary hover:text-white transition-colors">
                服务条款
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-gray-secondary flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-secondary">
            © 2024 AI Boss. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="https://twitter.com" className="text-sm text-gray-secondary hover:text-white transition-colors">
              Twitter
            </Link>
            <Link href="https://github.com" className="text-sm text-gray-secondary hover:text-white transition-colors">
              GitHub
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
