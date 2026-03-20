'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './Hero.module.scss'
import Container from '@/components/ui/Container/Container'
import Button from '@/components/ui/Button/Button'

type VisualState = 'default' | 'hover' | 'toHover' | 'toDefault'

export default function Hero() {
  const [visualState, setVisualState] = useState<VisualState>('default')
  const autoTimerRef = useRef<number | null>(null)

  useEffect(() => {
    autoTimerRef.current = window.setTimeout(() => {
      setVisualState((prev) => (prev === 'default' ? 'toHover' : prev))
    }, 1200)

    return () => {
      if (autoTimerRef.current) {
        window.clearTimeout(autoTimerRef.current)
      }
    }
  }, [])

  function handleAnimationEnd() {
    setVisualState((prev) => {
      if (prev === 'toHover') return 'hover'
      if (prev === 'toDefault') return 'default'
      return prev
    })
  }

  function handleMouseEnter() {
    setVisualState((prev) => {
      if (prev === 'hover') return 'toDefault'
      if (prev === 'toHover') return 'toDefault'
      return prev
    })
  }

  function handleMouseLeave() {
    setVisualState((prev) => {
      if (prev === 'default') return 'toHover'
      if (prev === 'toDefault') return 'toHover'
      return prev
    })
  }

  const mediaClassName = [
    styles.media,
    visualState === 'default' ? styles.stateDefault : '',
    visualState === 'hover' ? styles.stateHover : '',
    visualState === 'toHover' ? styles.toHover : '',
    visualState === 'toDefault' ? styles.toDefault : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <section className={styles.hero} id="home">
      <Container>
        <div className={styles.card}>
          <div className={styles.content}>
            <div className={styles.textBlock}>
              <h1 className={styles.title}>
                ПРОФЕССИОНАЛЬНЫЙ
                <br />
                ТЮНИНГ ПРИБОРНЫХ
                <br />
                ПАНЕЛЕЙ АВТО
              </h1>

              <p className={styles.description}>
                Кастомные шкалы, идеальная точность,
                <br />
                эксклюзивный дизайн
              </p>

              <p className={styles.caption}>
                Работаем по всей России — отправка СДЭК
              </p>
            </div>

            <div className={styles.actions}>
              <Button href="#contact" variant="primary" size="sm">
                Узнать подробнее
              </Button>

              <Button href="#works" variant="secondary" size="sm">
                Смотреть работы
              </Button>
            </div>
          </div>

          <div
            className={mediaClassName}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className={styles.imageBase} />

            <div className={styles.imageHover} onAnimationEnd={handleAnimationEnd} />

            <div className={styles.shine} />
          </div>
        </div>
      </Container>
    </section>
  )
}