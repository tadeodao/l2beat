import cx from 'classnames'
import React, { ReactNode } from 'react'

import { NewItemIcon } from '../icons/NewItemIcon'

export interface MobileTabsProps {
  pages: {
    shortTitle: ReactNode
    link: string
    selected: boolean
    new?: boolean
  }[]
}

export function MobileTabs({ pages }: MobileTabsProps) {
  return (
    <ul
      className={cx(
        'flex md:hidden gap-2 py-2 justify-center items-center -mx-4',
        'bg-gray-100 dark:bg-gray-950 border-b border-b-gray-200 dark:border-b-gray-850',
      )}
    >
      {pages.map((page, i) => (
        <li key={i} className={cx('w-28 max-w-[27vw]')}>
          <a
            href={page.link}
            className={cx(
              'block w-full text-center font-bold py-1 rounded',
              page.selected &&
                'text-white bg-gradient-to-r from-purple-100 to-pink-100',
              !page.selected && 'bg-white dark:bg-gray-850',
            )}
          >
            <span className={cx(page.new && 'inline-flex items-center gap-1')}>
              {page.shortTitle} {page.new && <NewItemIcon />}
            </span>
          </a>
        </li>
      ))}
    </ul>
  )
}
