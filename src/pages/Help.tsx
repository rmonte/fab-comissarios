import { useNavigate } from 'react-router-dom'
import { ArrowLeft, WifiOff, Share, PlusSquare, MoreVertical, Download, CheckCircle, Smartphone } from 'lucide-react'
import AppHeader from '@/components/AppHeader'
import { Button } from '@/components/ui/button'

interface Step {
  icon: React.ReactNode
  text: string
}

function StepList({ steps }: { steps: Step[] }) {
  return (
    <ol className="flex flex-col gap-3">
      {steps.map((step, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0 mt-0.5">
            {i + 1}
          </span>
          <div className="flex items-center gap-2 text-sm text-muted-foreground leading-relaxed">
            {step.icon && (
              <span className="shrink-0 text-foreground/60">{step.icon}</span>
            )}
            <span>{step.text}</span>
          </div>
        </li>
      ))}
    </ol>
  )
}

function PlatformCard({
  title,
  subtitle,
  badge,
  badgeColor,
  steps,
  note,
}: {
  title: string
  subtitle: string
  badge: string
  badgeColor: string
  steps: Step[]
  note: string
}) {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center gap-3">
        <Smartphone className="w-5 h-5 text-primary shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground text-sm">{title}</p>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full shrink-0 ${badgeColor}`}>
          {badge}
        </span>
      </div>
      <div className="px-5 py-4">
        <StepList steps={steps} />
        <div className="mt-4 flex items-start gap-2 px-3 py-2.5 bg-muted/50 rounded-lg">
          <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">{note}</p>
        </div>
      </div>
    </div>
  )
}

export default function Help() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background">
      <AppHeader action={
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="text-white/70 hover:text-white hover:bg-white/10 gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
      } />

      <main className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-6">

        {/* Intro */}
        <div className="flex items-start gap-4 bg-card rounded-xl border border-border px-5 py-4 shadow-sm">
          <WifiOff className="w-8 h-8 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-foreground mb-1">Acesso offline</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Este app funciona sem internet após ser instalado na tela inicial do celular.
              Todo o conteúdo fica salvo no aparelho — ideal para consulta durante voos ou
              em áreas sem sinal.
            </p>
          </div>
        </div>

        {/* iPhone */}
        <PlatformCard
          title="iPhone"
          subtitle="iOS 16.4 ou superior"
          badge="Safari"
          badgeColor="bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400"
          steps={[
            {
              icon: null,
              text: 'Abra o Safari — não funciona pelo Chrome ou Firefox no iPhone.',
            },
            {
              icon: null,
              text: `Acesse o endereço: rmonte.github.io/fab-comissarios`,
            },
            {
              icon: <Share className="w-4 h-4" />,
              text: 'Toque no botão Compartilhar (quadrado com seta para cima, na barra inferior).',
            },
            {
              icon: <PlusSquare className="w-4 h-4" />,
              text: 'Role a lista de opções e toque em "Adicionar à Tela de Início".',
            },
            {
              icon: null,
              text: 'Confirme o nome do app e toque em "Adicionar" no canto superior direito.',
            },
          ]}
          note="O ícone do app aparece na tela inicial. Abra ao menos uma vez com internet para o conteúdo ser salvo. Depois disso, funciona 100% offline."
        />

        {/* Android */}
        <PlatformCard
          title="Android"
          subtitle="Android 8 ou superior"
          badge="Chrome"
          badgeColor="bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-400"
          steps={[
            {
              icon: null,
              text: 'Abra o Chrome — é o navegador recomendado para instalação no Android.',
            },
            {
              icon: null,
              text: 'Acesse o endereço: rmonte.github.io/fab-comissarios',
            },
            {
              icon: <MoreVertical className="w-4 h-4" />,
              text: 'Toque nos três pontos (⋮) no canto superior direito da tela.',
            },
            {
              icon: <Download className="w-4 h-4" />,
              text: 'Toque em "Adicionar à tela inicial" ou "Instalar app", se disponível.',
            },
            {
              icon: null,
              text: 'Confirme tocando em "Adicionar" ou "Instalar" na caixa de diálogo.',
            },
          ]}
          note="O ícone do app aparece na tela inicial ou na gaveta de apps. Abra ao menos uma vez com internet para salvar o conteúdo offline."
        />

        {/* Dúvidas comuns */}
        <div className="bg-card rounded-xl border border-border shadow-sm px-5 py-4">
          <p className="font-semibold text-foreground text-sm mb-3">Dúvidas frequentes</p>
          <div className="flex flex-col gap-3">
            {[
              {
                q: 'O conteúdo é atualizado automaticamente?',
                a: 'Sim. Quando há internet disponível, o app verifica se existe uma versão mais recente e atualiza em segundo plano.',
              },
              {
                q: 'Precisa de conta ou login?',
                a: 'Não. O app é de acesso livre, sem necessidade de cadastro.',
              },
              {
                q: 'Funciona em tablets?',
                a: 'Sim. O processo de instalação é o mesmo — Safari no iPad, Chrome no Android.',
              },
            ].map(({ q, a }) => (
              <div key={q}>
                <p className="text-sm font-medium text-foreground">{q}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{a}</p>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  )
}
