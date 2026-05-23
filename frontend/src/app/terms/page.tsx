export default function TermsPage() {
  return (
    <div className="bg-white">
      <section className="px-6 py-16 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 border-b border-gray-border pb-8">
            <p className="mb-4 text-sm font-semibold text-primary">最后更新：2026-05-23</p>
            <h1 className="text-4xl font-semibold tracking-tight text-gray-dark lg:text-5xl">
              服务条款
            </h1>
            <p className="mt-5 text-base leading-8 text-gray-secondary">
              使用 AI Boss 即表示你同意遵守以下条款。公开运营前，请根据实际主体、收费方式、服务区域和适用法律进一步审阅。
            </p>
          </div>

          <div className="space-y-10 text-gray-dark">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">服务性质</h2>
              <p className="leading-8 text-gray-secondary">
                AI Boss 提供面向任务的 AI 生成服务。输出内容由大语言模型生成，可能存在不准确、不完整或不适合特定场景的情况。
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">用户责任</h2>
              <p className="leading-8 text-gray-secondary">
                你应确保提交内容合法、拥有必要权利，并且不会侵犯第三方权益。你不得提交密钥、密码、受监管个人数据、违法内容或你无权处理的机密资料。
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">专业建议限制</h2>
              <p className="leading-8 text-gray-secondary">
                AI 输出不构成法律、财务、医疗、投资、审计或其他专业意见。涉及高风险决策时，请咨询具备资质的专业人士。
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">内容权利</h2>
              <p className="leading-8 text-gray-secondary">
                你保留对自己输入内容的权利。你可以在遵守适用法律和 LLM 服务商条款的前提下使用生成结果。项目源码的使用另受仓库 MIT 许可证约束。
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">可用性与变更</h2>
              <p className="leading-8 text-gray-secondary">
                服务可能因模型、数据库、网络、限流或维护而中断。项目方可以调整功能、模型、价格标签、速率限制或部署方式。
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">禁止行为</h2>
              <p className="leading-8 text-gray-secondary">
                不得滥用接口、绕过限流、攻击服务、上传恶意内容、侵犯知识产权、生成违法内容，或试图提取系统提示和密钥。
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">免责声明</h2>
              <p className="leading-8 text-gray-secondary">
                在法律允许范围内，服务按现状提供，不承诺输出准确性、连续可用性或适合特定用途。你应自行审核并承担使用输出的风险。
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">第三方服务与商标</h2>
              <p className="leading-8 text-gray-secondary">
                OpenAI、DeepSeek、Supabase、Vercel、Railway、Render 等名称归各自权利人所有。仓库中的提及不表示官方合作、背书或授权关系。
              </p>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}
