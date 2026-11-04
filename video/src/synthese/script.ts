// Voix off de la vidéo de synthèse (voix ElevenLabs « Lucie narration »).
// Le texte sert aussi à caler les animations sur la voix.
export const NARRATION: Record<string, string> = {
  v01: "Boomerang Marketing SA prépare sa transmission. Yvan cède progressivement l'agence à Jérémy. Voici, en quelques minutes, la proposition de reprise et son plan de financement.",
  v02: "Tout part d'une valeur. Selon la méthode des praticiens, la valeur de rendement atteint un virgule vingt-huit million, et la valeur substantielle quatre cent soixante-six mille francs. La valeur fiscale, qui compte deux fois le rendement pour une fois la substance, donne un million. C'est le prix de référence : dix mille francs par action.",
  v03: "Le cadre posé à l'été deux mille vingt-six est simple. Jérémy achète les actions directement à Yvan. Il en finance une partie en cash, et le reste par un prêt vendeur à taux préférentiel. Ce prêt est ensuite remboursé par les dividendes que verse l'agence.",
  v04: "Le plan initial prévoyait cinq tranches de vingt pour cent, une tous les deux ans. Le problème : le remboursement est fixe, quatre-vingt mille francs par an, alors que les dividendes ne grandissent qu'avec la part détenue. Avec les impôts et les intérêts, chaque année est déficitaire jusqu'en deux mille trente-quatre. Le déficit cumulé atteint cent septante-huit mille quatre cents francs, même avec deux cent mille francs de fonds privés. En l'état, ce plan n'est pas soutenable.",
  v05: "L'analyse complémentaire de Bonvesting repart donc d'hypothèses prudentes. Un bénéfice de cent mille francs par an, contre cent septante-neuf mille en deux mille vingt-cinq. Cent cinquante mille francs distribués chaque année jusqu'en deux mille trente-deux, dont cinquante mille pris sur les réserves, qui passent de trois cent soixante-trois mille à soixante-trois mille francs. Et cinq risques intégrés : le nouveau loyer, le marché et l'IA, la continuité du réseau, la qualité du chiffre d'affaires, et la cotisation LPP.",
  v06: "D'où notre proposition : deux grandes étapes, au lieu de cinq petites. Le premier janvier deux mille vingt-sept, Jérémy acquiert quarante-cinq pour cent, pour quatre cent cinquante mille francs : cent mille de fonds privés à la signature, et trois cent cinquante mille de prêt vendeur, remboursés environ cinquante-huit mille trois cents francs par an, sur six ans. Le premier janvier deux mille trente-trois, une seconde tranche de quarante-cinq pour cent, financée de la même manière, porte sa part à nonante pour cent. Les dix pour cent restants seront à définir.",
  v07: "Pourquoi cela tient-il ? Sur les cent cinquante mille francs distribués, Yvan perçoit environ quatre-vingt-deux mille cinq cents francs, et Jérémy soixante-sept mille cinq cents : de quoi couvrir l'amortissement d'environ cinquante-huit mille trois cents francs. Après impôts et intérêts, le solde reste proche de l'équilibre : entre moins deux mille quatre cent quatre-vingt-trois, et moins mille vingt-cinq francs par an. Dès deux mille trente-trois, il devient positif, au-dessus de quinze mille francs par an. Là où le plan initial creusait un déficit de cent septante-huit mille quatre cents francs.",
  v08: "Deux garde-fous protègent l'agence : un niveau de trésorerie minimal, fixé ensemble, et une année faible qui décale le remboursement, sans pénalité.",
  v09: "Côté gouvernance, capital et direction restent deux sujets distincts. Jusqu'en deux mille trente-deux, Yvan reste majoritaire, directeur général et président du conseil. Jérémy est administrateur et directeur adjoint. Budget, ressources humaines, dividendes, statuts et calendrier se décident à deux, avec un comité de transition mensuel et une signature collective. Dès deux mille trente-trois, Jérémy devient majoritaire. Piste de travail : Jérémy directeur, Yvan conseiller stratégique et porteur d'affaires.",
  v10: "En résumé, trois temps. Entrer : quarante-cinq pour cent, le premier janvier deux mille vingt-sept. Accompagner : six ans de transition, et le premier prêt soldé fin deux mille trente-deux. Transmettre : nonante pour cent en deux mille trente-trois, et le second prêt soldé fin deux mille trente-huit, avec la retraite d'Yvan.",
  v11: "Prochaine étape : valider ensemble ces principes. D'ici fin deux mille vingt-six, mettre à jour la convention d'actionnaires, la convention de vente et le contrat de prêt, les faire relire par la fiduciaire et un notaire, et tenir l'assemblée générale extraordinaire. L'objectif : signer avant le premier janvier deux mille vingt-sept.",
};

// Chapitre affiché pour chaque scène (structure du sommaire du dossier).
export const CHAPTER: Record<string, number> = {
  v01: 0,
  v02: 1,
  v03: 1,
  v04: 2,
  v05: 2,
  v06: 3,
  v07: 3,
  v08: 3,
  v09: 4,
  v10: 4,
  v11: 5,
};

export const CHAPTERS = [
  "Point de départ",
  "Le plan proposé et son test",
  "Notre proposition",
  "Gouvernance et transition",
  "Prochaines étapes",
];
