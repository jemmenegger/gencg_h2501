# Week 5 – Parametric Faces

## Exploration & Experimentation

Diese Woche habe ich mein **Face-Generator-System** aufgebaut: statt frei zu zeichnen, entsteht jede „Figur“ aus **fixen Grundformen**, die **immer dieselben bleiben**, aber **anders überlagert und positioniert** werden. So wirkt jede Ausgabe neu, ohne dass das Vokabular der Formen wechselt.

> Idee: **Ein festes Set von ~20 Shapes** (Face-Flächen, Augen, Nase, Mund, Haare). Die Engine wählt Positionen, Grössen und Ebenen neu – das Auge erkennt Gesichter, obwohl nur abstrakte Bausteine verschoben werden.

---

## Live Demo

<iframe src="content/week05/embed.html" width="100%" height="600" frameborder="no"></iframe>

---

## Prozess & Iterationen

### 1) Baukasten definieren
- **Konstantes Set** von Formen: 6–10 „Face-Tiles“ (Rechtecke, Rundungen), **2 Augen** (weiss + farbige Iris-Ringe + Pupille), **Nasen-Varianten** (u. a. runde „Kartoffel“-Nase), **Mund-Silhouetten** (voll, dünn, Cupid-Bow, downturned), **Haar-Cluster** (Bögen, Wolken).
- **Palette** mit 6–8 Farben für den Face-Layer und eine **global abgedunkelte** Version derselben für den Hintergrund.

### 2) Platzierung & Regeln
- **Face-Cluster** entsteht zentral aus 3–4 Shapes, die sich zu einer klaren Gesamtform „verdichten“.
- **Feature-Bänder**: Augen im oberen Drittel, Nase mittig, Mund unten.
- **Kollisionsboxen** verhindern Überlappungen von Augen/Nase/Mund.
- **Haare** nur im oberen Face-Band, mit Seitenabstand (Ohren frei).
- **Immer zwei Augen** sichtbar; Features bleiben **innerhalb der Face-Maske**.

### 3) Hintergrund & Abgrenzung
- **Gekachelter Hintergrund** in Clustern (gekoppelte Farbwiederholung), gleiche Palette, **einheitlich dunkler**, damit das Gesicht klar „vorn“ steht.
- Keine Konturlinien nötig; Kontrast entsteht durch **farbliche Staffelung**.

---

## Ergebnisse (Snapshots)

<div style="display:flex; gap:10px; flex-wrap:wrap; justify-content:center; align-items:flex-start; text-align:center;">
  <figure style="margin:0;">
    <img src="content/week05/img1.webp" width="300" alt="Face Generator Output 1">
    <figcaption style="font-size:0.9em;">a) dichter Face-Cluster, vertikale Augenrotation</figcaption>
  </figure>
  <figure style="margin:0;">
    <img src="content/week05/img2.webp" width="300" alt="Face Generator Output 2">
    <figcaption style="font-size:0.9em;">b) Kartoffel-Nase, Cupid-Bow-Lippen, Haar-Wolken</figcaption>
  </figure>
  <figure style="margin:0;">
    <img src="content/week05/img3.webp" width="300" alt="Face Generator Output 3">
    <figcaption style="font-size:0.9em;">c) minimaler Mund, starke Iris-Ringe, rechteckige Face-Tiles</figcaption>
  </figure>
</div>

---

## Systemlogik (kurz)

**Form-Vokabular (fix):**  
- ~6–10 Face-Tiles, **2 Augen**, 1 Nase (aus 4 Varianten), 1 Mund (aus 6 Varianten), 1–3 Haar-Cluster, 2 Ohren.  
- **Keine neuen Formen** – nur **Position, Skala, Rotation, Ebene** variieren.

**Platzierung:**  
- Face-Maske als „gültige Fläche“ für Features.  
- `getFeaturePos()` sucht Zufallspositionen **innerhalb** der Maske; Bounding-Boxes verhindern Überschneidungen.

**Hintergrund:**  
- Grobe Zellen → feine Kacheln, **Farb-Clustering** durch Nachbar-Wiederverwendung, **global dunkler** als Face-Palette.

**Reroll:**  
- Alle **4 Sekunden** neue Kombination (konstante Shapes, neue Anordnung).

---

## Einflüsse & Referenzen

- **Vera Molnár** – *Interruptions (1969)*: strenge Raster, bewusst gebrochene Ordnung. Das Gesicht entsteht hier ähnlich aus **regelhaften Bausteinen**, die **minimal gestört** werden.
- **Georg Nees** – frühe Regel-Zeichnungen: Systemdenken und Emergenz.
- **Matthias Dörfelt & Zach Lieberman** – parametrische Varianz mit **klarem Formvokabular** statt ständig neuen Elementen.

---

## Technische Notizen

- p5.js im Editor, keine externen Abhängigkeiten.
- **Masken-Ansatz** für „inside face only“ (Offscreen-Buffer, Alphakanal-Prüfung).
- **Kollisionsprüfung** via AABB-Boxen.
- **Haar-Sperrzone** an den Seiten, damit Ohren frei bleiben.

---

## Reflexion & Nächstes

Der Generator zeigt, wie **Wiederholung + Neuordnung** starke Varianz erzeugen kann. Gerade weil die Formen **gleich bleiben**, werden **Komposition, Farbe und Gewichtung** zur Bühne der Veränderung – das Auge vervollständigt das Gesicht.

Als nächstes:  
- **Preset-Seeds** für reproduzierbare Charaktere,  
- **Serien-Export** (Sprite-Sheets),  
- **„Mood-Achse“**, die mehrere Parameter gemeinsam verschiebt (z. B. Mundform, Augenrotation, Haarfülle).
