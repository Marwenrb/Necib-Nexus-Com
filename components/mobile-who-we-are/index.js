import React, { useEffect, useRef } from 'react';
import { useMediaQuery } from '@darkroom.engineering/hamo';
import s from './mobile-who-we-are.module.scss';

export const MobileWhoWeAre = ({ features }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const paragraphRefs = useRef([]);

  useEffect(() => {
    // Ne chargez les scripts et n'exécutez les animations que si l'appareil est mobile
    if (!isMobile) return;

    // Importation dynamique de ScrollMagic et GSAP
    const importDependencies = async () => {
      try {
        // Chargement de GSAP
        const gsapScript = document.createElement('script');
        gsapScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.4/gsap.min.js';
        gsapScript.async = true;
        
        // Chargement de ScrollMagic
        const scrollMagicScript = document.createElement('script');
        scrollMagicScript.src = '//cdnjs.cloudflare.com/ajax/libs/ScrollMagic/2.0.7/ScrollMagic.min.js';
        scrollMagicScript.async = true;
        
        // Chargement du plugin GSAP pour ScrollMagic
        const scrollMagicGSAPScript = document.createElement('script');
        scrollMagicGSAPScript.src = '//cdnjs.cloudflare.com/ajax/libs/ScrollMagic/2.0.7/plugins/animation.gsap.min.js';
        scrollMagicGSAPScript.async = true;
        
        // Plugin TextPlugin pour GSAP (pour l'effet de typewriter)
        const gsapTextPlugin = document.createElement('script');
        gsapTextPlugin.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.4/TextPlugin.min.js';
        gsapTextPlugin.async = true;
        
        // Ajout des scripts au document
        document.head.appendChild(gsapScript);
        document.head.appendChild(scrollMagicScript);
        document.head.appendChild(scrollMagicGSAPScript);
        document.head.appendChild(gsapTextPlugin);
        
        // Attendre que tous les scripts soient chargés
        await Promise.all([
          new Promise(resolve => gsapScript.onload = resolve),
          new Promise(resolve => scrollMagicScript.onload = resolve),
          new Promise(resolve => scrollMagicGSAPScript.onload = resolve),
          new Promise(resolve => gsapTextPlugin.onload = resolve)
        ]);
        
        // Initialiser les animations une fois les scripts chargés
        initAnimations();
      } catch (error) {
        console.error('Erreur lors du chargement des dépendances:', error);
      }
    };

    const initAnimations = () => {
      const { gsap } = window;
      const { TextPlugin } = window;
      const ScrollMagic = window.ScrollMagic;
      
      // Enregistrer le plugin TextPlugin
      gsap.registerPlugin(TextPlugin);
      
      // Créer un contrôleur ScrollMagic
      const controller = new ScrollMagic.Controller();
      
      // Animation du titre avec effet de flou
      const titleTween = gsap.timeline()
        .fromTo(
          titleRef.current, 
          { 
            y: 30, 
            opacity: 0,
            filter: 'blur(10px)'
          }, 
          { 
            y: 0, 
            opacity: 1, 
            filter: 'blur(0px)',
            duration: 1, 
            ease: "power3.out" 
          }
        );
      
      // Scène ScrollMagic pour le titre
      new ScrollMagic.Scene({
        triggerElement: titleRef.current,
        triggerHook: 0.9, // Déclenchement plus tôt sur mobile
        reverse: false
      })
      .setTween(titleTween)
      .addTo(controller);
      
      // Animation et scènes pour chaque paragraphe
      paragraphRefs.current.forEach((para, index) => {
        if (!para) return;
        
        // Animation pour chaque paragraphe avec délai progressif
        const paraTween = gsap.timeline()
          .fromTo(
            para, 
            { 
              y: 20, 
              opacity: 0,
              filter: 'blur(5px)'
            }, 
            { 
              y: 0, 
              opacity: 1,
              filter: 'blur(0px)',
              duration: 0.8, 
              ease: "power2.out",
              delay: index * 0.2
            }
          );
        
        // Effet de typewriter pour les paragraphes
        const paraContent = para.textContent;
        para.textContent = '';
        
        const typewriterTween = gsap.to(para, {
          duration: 2,
          text: {
            value: paraContent,
            delimiter: ""
          },
          ease: "none",
          delay: 0.3 + index * 0.3
        });
        
        // Scène ScrollMagic pour chaque paragraphe
        new ScrollMagic.Scene({
          triggerElement: para,
          triggerHook: 0.8,
          reverse: false
        })
        .setTween(typewriterTween)
        .addTo(controller);
      });
    };

    // Charger les dépendances
    importDependencies();

    return () => {
      // Nettoyage si nécessaire
    };
  }, [isMobile]);

  // Si ce n'est pas un appareil mobile, ne rien rendre
  if (!isMobile) return null;

  return (
    <section id="mobile-who-we-are" className={s.mobileWhoWeAre} ref={sectionRef}>
      <div className={s.container}>
        <h2 id="mobile-section-title" className={s.sectionTitle} ref={titleRef}>Who We Are</h2>
        <div id="mobile-content" className={s.content}>
          {features && features.map((feature, index) => (
            <div key={index} className={s.featureItem}>
              {feature.title && <h3 className={s.featureTitle}>{feature.title}</h3>}
              <p 
                id={`mobile-paragraph${index+1}`} 
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

export default MobileWhoWeAre; 