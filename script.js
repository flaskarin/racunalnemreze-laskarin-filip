const ipv6Input = document.getElementById("ipv6Input");
const shortenBtn = document.getElementById("shortenBtn");
const clearBtn = document.getElementById("clearBtn");
const result = document.getElementById("result");
const message = document.getElementById("message");

function isValidFullIPv6(address) {
  const parts = address.split(":");

  if (parts.length !== 8) {
    return false;
  }

  const hexGroupRegex = /^[0-9a-fA-F]{4}$/;
  return parts.every(part => hexGroupRegex.test(part));
}
function removeLeadingZeros(parts) {
  return parts.map(part => {
    const shortened = part.replace(/^0+/, "");
    return shortened === "" ? "0" : shortened.toLowerCase();
  });
}

function findLongestZeroSequence(parts) {
  let bestStart = -1;
  let bestLength = 0;
  let currentStart = -1;
  let currentLength = 0;

  for (let i = 0; i < parts.length; i++) {
    if (parts[i] === "0") {
      if (currentStart === -1) {
        currentStart = i;
        currentLength = 1;
      } else {
        currentLength++;
      }
    } else {
      if (currentLength > bestLength) {
        bestStart = currentStart;
        bestLength = currentLength;
      }
      currentStart = -1;
      currentLength = 0;
    }
  }

  if (currentLength > bestLength) {
    bestStart = currentStart;
    bestLength = currentLength;
  }

  return bestLength >= 2 ? { start: bestStart, length: bestLength } : null;
}

function compressIPv6(address) {
  const fullParts = address.split(":");
  const shortParts = removeLeadingZeros(fullParts);
  const zeroSequence = findLongestZeroSequence(shortParts);

  if (!zeroSequence) {
    return shortParts.join(":");
  }

  const before = shortParts.slice(0, zeroSequence.start);
  const after = shortParts.slice(zeroSequence.start + zeroSequence.length);

  if (before.length === 0 && after.length === 0) {
    return "::";
  }

  if (before.length === 0) {
    return "::" + after.join(":");
  }

  if (after.length === 0) {
    return before.join(":") + "::";
  }

  return before.join(":") + "::" + after.join(":");
}
function handleShorten() {
  const input = ipv6Input.value.trim();

  if (!isValidFullIPv6(input)) {
    result.textContent = "—";
    message.textContent = "Neispravan unos. IPv6 adresa mora imati točno 8 blokova, a svaki blok mora sadržavati točno 4 heksadekadska znaka.";
    return;
  }

  const compressed = compressIPv6(input);
  result.textContent = compressed;
  message.textContent = "Adresa je uspješno skraćena.";
}

function handleClear() {
  ipv6Input.value = "";
  result.textContent = "—";
  message.textContent = "Unesi adresu i klikni na “Skrati”.";
}

shortenBtn.addEventListener("click", handleShorten);
clearBtn.addEventListener("click", handleClear);

ipv6Input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleShorten();
  }
});