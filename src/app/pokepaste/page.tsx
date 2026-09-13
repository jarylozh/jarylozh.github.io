"use client";

import { useState } from "react";

import { Section, SectionHeading } from "@/components/section";
import { MetaRow } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { PokemonSet, PokepasteFormatError } from "./pokemon-set";

const PLACEHOLDER = `Landorus-Therian @ Assault Vest
Ability: Intimidate
Level: 50
Tera Type: Water
EVs: 252 HP / 4 Atk / 252 SpD
Careful Nature
- Earthquake
- Rock Slide
- U-turn
- Taunt`;

/** Turns a Pokepaste export into its Champions equivalent. */
function convertPokepaste(paste: string): string {
  const blocks = paste
    .split(/\n\s*\n/)
    .filter((block) => block.trim().length > 0);

  if (blocks.length === 0) return "No sets found in that paste.";

  try {
    return blocks
      .map((block) => PokemonSet.fromString(block).toChampions().toString())
      .join("\n\n");
  } catch (error) {
    if (error instanceof PokepasteFormatError) return error.message;
    throw error;
  }
}

export default function Pokepaste() {
  const [paste, setPaste] = useState("");
  const [output, setOutput] = useState("");

  return (
    <Section id="converter">
      <SectionHeading
        as="h1"
        eyebrow={["Tool"]}
        description="Paste a team export and convert its spreads to the Champions scale."
      >
        Pokepaste Converter
      </SectionHeading>

      <div className="flex flex-col gap-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-3">
            <MetaRow>
              <label htmlFor="pokepaste-input">Paste</label>
              <span>Team export</span>
            </MetaRow>
            <Textarea
              id="pokepaste-input"
              value={paste}
              onChange={(event) => setPaste(event.target.value)}
              placeholder={PLACEHOLDER}
              spellCheck={false}
              className="min-h-80 sm:min-h-96"
            />
          </div>

          <div className="flex flex-col gap-3">
            <MetaRow>
              <label htmlFor="pokepaste-output">Output</label>
              <span>Converted sets</span>
            </MetaRow>
            <Textarea
              id="pokepaste-output"
              value={output}
              readOnly
              placeholder="Converted spreads land here."
              className="min-h-80 sm:min-h-96"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            size="lg"
            disabled={paste.trim().length === 0}
            onClick={() => setOutput(convertPokepaste(paste))}
          >
            Convert
          </Button>
        </div>
      </div>
    </Section>
  );
}
