import { GlassPanel, Select, Tag } from 'auralith-ui'
import type { Language, ThemeMode } from '../data'

type HeaderProps = {
  appName: string
  text: any
  language: Language
  setLanguage: (lang: Language) => void
  themeMode: ThemeMode
  setThemeMode: (theme: ThemeMode) => void
}

export function Header({ appName, text, language, setLanguage, themeMode, setThemeMode }: HeaderProps) {
  return (
    <GlassPanel className="topbar">
      <Tag>{appName}</Tag>
      <div className="controls">
        <Select label={text.language} onValueChange={(value) => setLanguage(value === 'en' ? 'en' : 'pt')} value={language}>
          <Select.Option description="Português" label="PT" value="pt" />
          <Select.Option description="English" label="EN" value="en" />
        </Select>
        <Select
          label={text.theme}
          onValueChange={(value) => setThemeMode(value === 'light' || value === 'system' ? value : 'dark')}
          value={themeMode}
        >
          <Select.Option description="Night contrast" label={text.themes.dark} value="dark" />
          <Select.Option description="Neutral canvas" label={text.themes.light} value="light" />
          <Select.Option description="OS preference" label={text.themes.system} value="system" />
        </Select>
      </div>
    </GlassPanel>
  )
}
