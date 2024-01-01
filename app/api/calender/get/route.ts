import {NextResponse} from "next/server";
import * as fs from "fs";

const getCalenderData = async () => {

    const data = fs.readFileSync('data.json');

    return new NextResponse(data)
}

export {getCalenderData as GET};