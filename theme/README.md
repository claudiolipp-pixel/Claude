# AIRBALL Shopify Theme

Der Shop von airball.at als eigenes Shopify-Theme. Gleiche Marke, gleiche
Schriften, gleiche Farbwerte wie die Webseite, aber mit echten Preisen und
echtem Lagerstand aus dem Store.

Die Webseite bleibt React auf Cloudflare. Dieses Theme ist nur der Shop.

## Stand

Fertig und geprüft (`shopify theme check`: 32 Dateien, keine Beanstandung):

- Gerüst, Tokens, Schriften
- Kopf mit Wortmarke, DE/EN, Zurück-Knopf und Warenkorb
- Startseite: Bundles, Vertrauenszeile, Vereinsanfrage
- Produktseite: Galerie, Preis, Menge, Kaufen, Klappfelder, Details
- Warenkorb-Panel und Warenkorb-Seite ohne JavaScript
- Fuß, Suche, 404, Kollektion, Rechtsseiten
- Übersetzungen Deutsch und Englisch

Noch offen: Produktdaten (Material, Höhe, Betriebsdruck, Laufzeit der
Akkupumpe, Lieferzeiten), die Domain `shop.airball.at`, und die Rechtstexte
vom Anwalt.

## Einmal einrichten

```bash
npm install -g @shopify/cli@latest
```

## Ins Geschäft laden

Aus diesem Ordner heraus, also `cd theme`.

```bash
# Öffnet den Browser zum Anmelden und lädt das Theme als Entwicklungs-Theme
# hoch. Solange der Befehl läuft, wandert jede Änderung sofort mit.
shopify theme dev --store airball-8655.myshopify.com
```

Der Befehl gibt zwei Adressen aus: eine Vorschau und einen Link in den
Theme-Editor. **Ein Entwicklungs-Theme ist für Kunden unsichtbar** und
verschwindet nach sieben Tagen von selbst. Zum Anschauen ist das genau richtig.

Wenn es bleiben soll, ohne veröffentlicht zu werden:

```bash
shopify theme push --unpublished --theme "AIRBALL"
```

Veröffentlichen, also für Kunden sichtbar schalten, geht danach in der
Shopify-Verwaltung unter Onlineshop, Themes. Das ist bewusst kein Befehl hier:
solange AGB und Widerruf fehlen, darf nichts davon erreichbar sein.

## Was im Geschäft eingerichtet sein muss

Das Theme liest Daten, es erfindet keine. Damit die Startseite etwas anzeigt:

1. **Kollektion `bundles`** anlegen, die drei Bundles hineinlegen.
2. **Schlagwort `suggested`** auf Airball Pro, damit das gelbe Fähnchen dort
   erscheint.
3. **Produktfotos** in der gewünschten Reihenfolge hochladen. Die Reihenfolge
   im Shopify-Admin ist die Reihenfolge in der Galerie, das erste Bild ist das
   Titelbild.
4. **Vergleichspreis** je Bundle auf die Summe der Einzelteile setzen, dann
   erscheint der durchgestrichene Preis. Nur eintragen, wo der Vergleich
   stimmt.
5. **Menü `Rechtliches`** anlegen und im Fuß auswählen.
6. Im Theme-Editor beim Kopf die **Adresse der Webseite** eintragen, damit der
   Zurück-Knopf nach `https://airball.at` führt.

## Produkt-Metafelder

Drei Felder, die Shopify nicht von sich aus hat. Anlegen unter Einstellungen,
Benutzerdefinierte Daten, Produkte:

| Namensraum und Schlüssel | Typ | Wofür |
|---|---|---|
| `airball.lede` | Einzeiliger Text | Der Satz unter dem Produktnamen |
| `airball.in_the_box` | Liste einzeiliger Texte | Die Punkte unter „Enthalten“ |
| `airball.details` | Liste, JSON mit `label` und `value` | Die Detailtabelle unten |

Fehlt eines davon, lässt die Seite den Abschnitt weg statt einen leeren Kasten
zu zeigen.

## Prüfen, bevor etwas hochgeht

```bash
shopify theme check
```

Läuft ohne Store und ohne Anmeldung. Muss sauber sein.

## Wo die Marke herkommt

Die Farb- und Schriftwerte in `assets/theme.css` sind von Hand aus
`tailwind.config.ts` im Webseiten-Projekt übernommen. Das ist eine echte
Verdopplung: Wer die Marke ändert, muss beide Stellen anfassen. Das ist der
Preis dafür, zwei Storefronts auf einem Design zu betreiben, und er steht hier,
damit ihn niemand später entdecken muss.
