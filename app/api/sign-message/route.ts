import { NextRequest, NextResponse } from "next/server";
import { createSign } from "crypto";
import { readFileSync } from "fs";
import { join } from "path";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    const privateKey = readFileSync(join(process.cwd(), "private-key.pem"), "utf8");
    const sign = createSign("SHA512");
    sign.update(message);
    const signature = sign.sign(privateKey, "base64");
    return new NextResponse(signature);
  } catch (e) {
    console.error(e);
    return new NextResponse("Error al firmar", { status: 500 });
  }
}