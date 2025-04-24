import React, { useEffect, useRef } from 'react';
import { useMediaQuery } from '@darkroom.engineering/hamo';
import s from './who-we-are.module.scss';

export const WhoWeAre = ({ features }) => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const paragraphRefs = useRef([]);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    // Importation dynamique de ScrollMagic et GSAP pour éviter les problèmes de SSR
    const importDependencies = async () => {
      try {
        // Créer un élément script pour GSAP
        const gsapScript = document.createElement('script');
        gsapScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.4/gsap.min.js';
        gsapScript.async = true;
        
        // Créer un élément script pour ScrollMagic
        const scrollMagicScript = document.createElement('script');
        scrollMagicScript.src = '//cdnjs.cloudflare.com/ajax/libs/ScrollMagic/2.0.7/ScrollMagic.min.js';
        scrollMagicScript.async = true;
        
        // Créer un élément script pour le plugin ScrollMagic GSAP
        const scrollMagicGSAPScript = document.createElement('script');
        scrollMagicGSAPScript.src = '//cdnjs.cloudflare.com/ajax/libs/ScrollMagic/2.0.7/plugins/animation.gsap.min.js';
        scrollMagicGSAPScript.async = true;
        
        // Ajouter les scripts au document
        document.head.appendChild(gsapScript);
        document.head.appendChild(scrollMagicScript);
        document.head.appendChild(scrollMagicGSAPScript);
        
        // Attendre le chargement des scripts
        await Promise.all([
          new Promise(resolve => gsapScript.onload = resolve),
          new Promise(resolve => scrollMagicScript.onload = resolve),
          new Promise(resolve => scrollMagicGSAPScript.onload = resolve)
        ]);
        
        // Initialiser les animations une fois les scripts chargés
        initAnimations();
      } catch (error) {
        console.error('Erreur lors du chargement des dépendances:', error);
      }
    };

    // Fonction d'initialisation des animations
    const initAnimations = () => {
      const { gsap } = window;
      const ScrollMagic = window.ScrollMagic;
      
      // Créer un contrôleur ScrollMagic
      const controller = new ScrollMagic.Controller();
      
      // Animation du titre
      gsap.fromTo(
        titleRef.current, 
        { y: -50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, ease: "power2.out" }
      );
      
      // Scène ScrollMagic pour le titre
      new ScrollMagic.Scene({
        triggerElement: titleRef.current,
        triggerHook: 0.8,
        reverse: false
      })
      .setTween(gsap.fromTo(
        titleRef.current, 
        { y: -50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, ease: "power2.out" }
      ))
      .addTo(controller);
      
      // Animation et scènes pour chaque paragraphe
      paragraphRefs.current.forEach((para, index) => {
        if (!para) return;
        
        // Texte original pour l'effet de typewriter
        const originalText = para.textContent;
        para.textContent = '';
        
        // Animation de typewriter pour chaque paragraphe
        const typewriterTween = gsap.to(para, {
          duration: 2,
          text: {
            value: originalText,
            delimiter: ""
          },
          ease: "none",
          delay: index * 0.5
        });
        
        // Scène ScrollMagic pour chaque paragraphe
        new ScrollMagic.Scene({
          triggerElement: para,
          triggerHook: isMobile ? 0.9 : 0.8,
          reverse: false
        })
        .setTween(typewriterTween)
        .addTo(controller);
      });
    };

    // Importer les dépendances
    importDependencies();

    // Nettoyage
    return () => {
      // Nettoyage si nécessaire
    };
  }, [isMobile]);

  return (
    <section id="who-we-are" className={s.whoWeAre} ref={sectionRef}>
      <div className={s.container}>
        <h2 id="section-title" className={s.sectionTitle} ref={titleRef}>Who We Are</h2>
        <div id="content" className={s.content}>
          {features && features.map((feature, index) => (
            <div key={index} className={s.featureItem}>
              {feature.title && <h3 className={s.featureTitle}>{feature.title}</h3>}
              <p 
                id={`paragraph${index+1}`} 
                className={s.featureContent}
                ref={el => paragraphRefs.current[index] = el}
              >
                {feature.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre; 