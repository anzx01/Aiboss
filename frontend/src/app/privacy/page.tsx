export default function PrivacyPage() {
  return (
    <div className="bg-white">
      <section className="px-6 py-16 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 border-b border-gray-border pb-8">
            <p className="mb-4 text-sm font-semibold text-primary">最后更新：2026-05-23</p>
            <h1 className="text-4xl font-semibold tracking-tight text-gray-dark lg:text-5xl">
              隐私政策
            </h1>
            <p className="mt-5 text-base leading-8 text-gray-secondary">
              本政策说明 AI Boss 在提供数字 AI 员工任务服务时如何处理信息。公开部署前，请根据实际运营主体、服务器位置和 LLM 服务商进一步校准。
            </p>
          </div>

          <div className="space-y-10 text-gray-dark">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">我们收集的信息</h2>
              <p className="leading-8 text-gray-secondary">
                当你提交任务时，我们会处理你填写的任务输入、AI 生成的输出、任务状态、创建时间、完成时间和执行耗时。
                为了在无需注册的情况下关联任务历史，服务端会基于请求 IP 和 User-Agent 生成哈希标识，不会在数据库中保存原始 IP 或原始 User-Agent。
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">我们如何使用信息</h2>
              <p className="leading-8 text-gray-secondary">
                信息用于执行任务、展示任务结果、提供同一会话下的任务历史、排查错误、限制滥用请求和改进服务稳定性。
                我们不会出售你的任务内容。
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">第三方 LLM 服务</h2>
              <p className="leading-8 text-gray-secondary">
                任务输入会发送给配置的 OpenAI-compatible LLM 服务商，例如 DeepSeek 或 OpenAI。第三方服务商可能按照其自身条款处理请求内容。
                请不要提交密码、API Key、身份证件、医疗记录、财务账户、商业机密或其他敏感信息。
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">数据保存</h2>
              <p className="leading-8 text-gray-secondary">
                任务数据保存在你配置的 PostgreSQL 数据库中。默认代码没有内置自动删除策略；部署者应根据实际业务设置保留期限、备份策略和删除机制。
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">你的选择</h2>
              <p className="leading-8 text-gray-secondary">
                你可以避免提交敏感内容。若你是某个公开部署实例的用户，可以联系该实例运营者请求查询或删除与你会话相关的数据。
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">安全</h2>
              <p className="leading-8 text-gray-secondary">
                项目通过环境变量保存密钥，并使用请求频率限制降低滥用风险。部署者仍需自行配置 HTTPS、数据库访问控制、密钥轮换和日志脱敏。
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">联系我们</h2>
              <p className="leading-8 text-gray-secondary">
                如需反馈隐私问题，请通过 GitHub Issues 或仓库维护者提供的私密联系方式联系项目方。不要在公开 Issue 中粘贴密钥或敏感数据。
              </p>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}
