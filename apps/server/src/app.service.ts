import { Injectable } from "@nestjs/common"

@Injectable()
export class AppService {
   getHello(): string {
      return '<p>Intergallery Server</p><a href="/api"><button>API Documentations</button></a>'
   }
}
