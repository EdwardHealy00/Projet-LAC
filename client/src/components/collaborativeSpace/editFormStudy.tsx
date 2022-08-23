import React from "react";
import LockIcon from '@mui/icons-material/Lock';
import Button from "@mui/material/Button";

function EditFormStudy() {
  return (
    <div id="formStudyLayout">
      <div id="formStudy">
        <div>
          <div id="formStudyTitle">
            <h1>Machiavélisme</h1>
            <div id="formStudySummary">
              <div>
                <b>Mots clés :</b> Machiavélique, politique
              </div>
              <div>
                <b>Date :</b> 2017/03/17
              </div>
              <div>
                <b>Discipline :</b> Sciences politiques, génie industriel,
                gestion du changement
              </div>
            </div>
          </div>
          <div>
            <ol>
              <li>
                <u>Définition</u>
              </li>
              <li>
                <u>Historique</u>
              </li>
              <li>
                <u>Une philosophie à plusieurs niveaux</u>
              </li>
              <li>
                <u>Une philosophie controversée</u>
              </li>
              <li>
                <u>Études de cas en lien avec le machiavélisme</u>
                <ol>
                  <li>
                    <u>Quand le management martyrise les salariés</u>
                  </li>
                  <li>
                    <u>Leadership machiavélique</u>
                  </li>
                  <ol>
                    <li>
                      <u>
                        Leadership machiavélique dans la littérature des Écoles
                        de gestion
                      </u>
                    </li>
                  </ol>
                </ol>
              </li>
              <li>
                <u>Bibliographie</u>
              </li>
            </ol>
          </div>
        </div>

        <div id="formStudyImage">
          <img
            src="https://d1icd6shlvmxi6.cloudfront.net/gsc/DO5XFL/f5/5a/8e/f55a8ee178a54ea68ff3de70b494c075/images/espace_collaboratif_-_sans_connexion/u30.svg?pageId=216e9b47-321e-4a02-ab58-158ba2b72093"
            alt="Machiavel"
          />
          <div>Buste de Machiavel</div>
        </div>
      </div>
      
      <div>
        <h2>Définition</h2>
        <p>
            Le machiavélisme désigne dans le langage courant une conception de la
            politique prônant la conquête et la conservation du pouvoir par tous les
            moyens.
            <br /> <br />
            L'adjectif machiavélique, passé dans le langage courant, fait référence
            à l'interprétation noire et manipulatrice de l'ouvrage le plus connu de
            Machiavel, Le Prince (1531) ; il est à distinguer du terme machiavélien
            formé par contraste pour désigner les concepts issus de la philosophie
            politique de Machiavel, sans porter de jugement.
        </p>
      </div>
      
      <div>
        <h2>Historique</h2>
        <p>
            Ce terme, qui aurait été lancé par Henri Estienne, est attesté dans des
            publications françaises dès 1611. Il s'applique à l'ensemble des
            méthodes décrites par Machiavel dans Le Prince pour conquérir ou
            conserver le pouvoir. Comme le définit Raymond Aron, « le machiavélisme
            est l'effort pour percer à jour les hypocrisies de la comédie sociale,
            pour dégager les sentiments qui font véritablement mouvoir les hommes,
            pour saisir les conflits authentiques qui constituent la texture du
            devenir historique, pour donner une vision dépouillée de toute illusion
            de ce qu'est réellement la société ».
            <br /> <br />
            Les attaques contre Machiavel sont d'abord venues de religieux soucieux
            de préserver les apparences de moralité de la vie publique, surtout
            après le Concile de Trente, quand son ouvrage intitulé Le Prince a été
            mis à l'index. Ce traité expose l'art de la conquête et de la
            conservation du pouvoir, en se fondant sur la compréhension et la
            manipulation des sentiments humains et populaires. En ce sens, il
            tranche avec les traités politiques traditionnels, dont le but était
            d'éclairer le chef d'État sur l'usage juste et vertueux du pouvoir. De
            l'œuvre pourraient être retenues ces citations : « Car la force est
            juste quand elle est nécessaire », « Si tu peux tuer ton ennemi,
            fais-le, sinon fais t’en un ami », ou encore : « Sur cela s’est élevée
            la question de savoir s’il vaut mieux être aimé que craint, ou être
            craint qu’aimé ? On peut répondre que le meilleur serait d’être l’un et
            l’autre. Mais, comme il est très difficile que les deux choses existent
            ensemble, je dis que, si l’une doit manquer, il est plus sûr d’être
            craint que d’être aimé. »
        </p>
      </div>

      <div>
        <h2>Une philosophie à plusieurs niveaux</h2>
        <p>
            On peut ajouter que Le Prince n'était pas, au départ, destiné à être
            publié. Machiavel l'avait conçu comme un présent à son prince Laurent II
            de Médicis. Il voulait le faire profiter de sa connaissance acquise par
            une longue expérience des vicissitudes politiques de son époque, et par
            une étude assidue de l'histoire ancienne, en particulier celle de
            l'Antiquité.
            <br /> <br />
            En fait, tout autant que celui du cynisme, Machiavel peut être considéré
            comme le père du pragmatisme en politique. La vertu première du prince
            n'est en effet pas morale mais politique : c'est l'aptitude à conserver
            le pouvoir en sachant doser la crainte et l'amour qu'il peut inspirer,
            de façon à maintenir l'ordre et l'unité de sa cité.
        </p>
      </div>

      <div>
        <h2>Une philosophie controversée</h2>
        <p>
            Pour Jean-Jacques Rousseau, Le Prince est une dénonciation en filigrane
            de la tyrannie : « En feignant de donner des leçons aux rois, il en a
            donné de grandes aux peuples. Le Prince est le livre des républicains ».
            Cette interprétation n'est toutefois pas dominante chez les exégètes de
            Machiavel.
            <br /> <br />
            De nombreux auteurs, comme Frédéric II de Prusse, aidé par Voltaire
            (dans l'Anti-Machiavel) ont critiqué Machiavel. Mais, comme le souligne
            Napoléon, qui a largement commenté Le Prince, beaucoup ont lu Machiavel
            mais peu l'ont compris.
        </p>
      </div>

      <div>
        <div id="caseStudyLocked">
            <h2>Études de cas en lien avec le machiavélisme</h2>
            <Button variant="contained">
                <LockIcon />* Contenu exclusif aux membres de la plateforme 
                <br />
                Inscrivez-vous maintenant pour y avoir accès
            </Button>
        </div>
        <div className="case">
            <h3>Cas 1 - Version originale</h3>
            <div>
                <u>1. Quand le management martyrise les salariés</u>
                <LockIcon sx={{verticalAlign: 'sub'}} />
            </div>
        </div>
      </div>

      <div>
        <h2>Bibliographie</h2>
            <ul id="bibliography">
                <li>Raymond Aron, Les Étapes de la pensée sociologique, Gallimard, 1976.</li>
                <li>Alexis-François Artaud de Montor, Machiavel : son génie et ses erreurs. (2 tomes), 1833 (lire en ligne [archive]) Tome 2) [archive]</li>
                <li>Edouard Balladur, Machiavel en démocratie : Mécanique du pouvoir, Paris, Fayard, 2006</li>
                <li>Charles Benoist, « Le Machiavélisme et l’Anti-Machiavel », Revue des deux mondes,‎ 1915. Texte dans Wikisource.</li>
                <li>Charles Benoist, Le machiavélisme, Paris, Plon, 1934 (lire en ligne [archive]) (Deuxième partie [archive])</li>
            </ul>
      </div>
    </div>
  );
}

export default EditFormStudy;
