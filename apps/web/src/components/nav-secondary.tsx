"use client"

import * as React from "react"
import { type Icon } from "@tabler/icons-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

type PageType = 'overview' | 'trade' | 'history' | 'settings';

export function NavSecondary({
  items,
  onNavClick,
  ...props
}: {
  items: {
    title: string
    url: string
    icon: Icon
    key?: PageType
    isActive?: boolean
  }[]
  onNavClick?: (key?: PageType) => void
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                isActive={item.isActive}
                onClick={() => {
                  if (item.key) {
                    onNavClick?.(item.key)
                  } else {
                    // 对于没有key的项目（如Help和Search），可以保持原有的链接行为
                    window.open(item.url, '_self')
                  }
                }}
              >
                {React.createElement(item.icon as any) as any}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
