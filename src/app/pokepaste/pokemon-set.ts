type StatName = "Atk" | "Hp" | "Spd" | "SpDef" | "SpAtk" | "Def"
interface PokemonSetFields {
  name: string
  item: string
  nature: string
  evs: Partial<Record<StatName, number>>;
  version: "Legacy" | "Champions"
  moves: string[]
}

/** Raised when a block cannot be read as a Pokepaste set. */
export class PokepasteFormatError extends Error {
  name = "PokepasteFormatError"
}

// Stat labels in the order Pokepaste prints them.
const EV_LABELS: [StatName, string][] = [
  ["Hp", "HP"],
  ["Atk", "Atk"],
  ["Def", "Def"],
  ["SpAtk", "SpA"],
  ["SpDef", "SpD"],
  ["Spd", "Spe"],
]

// Pokepaste labels mapped back to field names.
const STAT_NAMES = new Map<string, StatName>(
  EV_LABELS.map(([stat, label]) => [label.toLowerCase(), stat]),
)

/** Reads the species and item off a set's first line. */
function parseHeader(line: string) {
  const [left, item] = line.split("@")
  const withoutGender = left.replace(/\s*\((?:M|F)\)\s*$/i, "").trim()
  const nicknamed = withoutGender.match(/^.*\((.+)\)$/)

  return {
    name: nicknamed ? nicknamed[1].trim() : withoutGender,
    item: item ? item.trim() : "",
  }
}

/** Reads `252 HP / 4 Atk / 252 SpD` into stat totals. */
function parseEvs(line: string) {
  const evs: PokemonSetFields['evs'] = {}

  for (const part of line.split("/")) {
    const match = part.trim().match(/^(\d+)\s+(\w+)$/)
    if (!match) continue

    const stat = STAT_NAMES.get(match[2].toLowerCase())
    if (stat) evs[stat] = Number(match[1])
  }

  return evs
}

export class PokemonSet {
  constructor(config: PokemonSetFields) {
    this.name = config.name
    this.item = config.item
    this.nature = config.nature
    this.evs = config.evs
    this.version = config.version
    this.moves = config.moves
  }
  private name: PokemonSetFields['name']
  private item: PokemonSetFields['item']
  private nature: PokemonSetFields['nature']
  private evs: PokemonSetFields['evs']
  private version: PokemonSetFields['version']
  private moves: PokemonSetFields['moves']

  /** Reads one Pokepaste block into a set. Throws when the block is malformed. */
  static fromString(
    block: string,
    version: PokemonSetFields['version'] = "Legacy",
  ): PokemonSet {
    const lines = block
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)

    if (lines.length === 0) {
      throw new PokepasteFormatError("A set in that paste is empty.")
    }

    const { name, item } = parseHeader(lines[0])
    if (!name) {
      throw new PokepasteFormatError(
        `Could not read a species from "${lines[0]}".`,
      )
    }

    let nature = ""
    let evs: PokemonSetFields['evs'] = {}
    const moves: string[] = []

    for (const line of lines.slice(1)) {
      if (line.startsWith("-")) {
        const move = line.slice(1).trim()
        if (move) moves.push(move)
        continue
      }

      if (line.toLowerCase().startsWith("evs:")) {
        evs = parseEvs(line.slice("evs:".length))

        if (Object.keys(evs).length === 0) {
          throw new PokepasteFormatError(
            `Could not read any stats from "${line}".`,
          )
        }
        continue
      }

      const natureMatch = line.match(/^([A-Za-z]+) Nature$/)
      if (natureMatch) nature = natureMatch[1]
    }

    return new PokemonSet({ name, item, nature, evs, version, moves })
  }

  toString(): string {
    const evs = EV_LABELS.filter(([stat]) => this.evs[stat]).map(
      ([stat, label]) => `${this.evs[stat]} ${label}`,
    )

    const lines = [this.item ? `${this.name} @ ${this.item}` : this.name]
    if (evs.length > 0) lines.push(`EVs: ${evs.join(" / ")}`)
    if (this.nature) lines.push(`${this.nature} Nature`)
    lines.push(...this.moves.map((move) => `- ${move}`))

    return lines.join("\n")
  }


  /** Rescales the EVs onto the Champions system. */
  toChampions(): this {
    if (this.version === "Champions") {
      return this
    }

    for (const [stat] of EV_LABELS) {
      const value = this.evs[stat]
      if (value === undefined) continue

      this.evs[stat] = Math.round(value / 8)
    }

    this.version = "Champions"

    return this
  }
}

