import {
	CanActivate,
	ExecutionContext,
	HttpStatus,
	Injectable,
	Scope,
	SetMetadata,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthNatsService } from 'src/modules/nats/auth-nats.service'
import { RequestExternal } from '../decorator/request-external'
import { BusinessException } from '../exception-filters/business-exception.filter'

const PERMISSION_CODE = 'PERMISSION_CODE'

export const Permission = (roles: string) => {
	return SetMetadata(PERMISSION_CODE, roles)
}

@Injectable({ scope: Scope.REQUEST })
export class AuthorizationGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private readonly authNatsService: AuthNatsService
	) { }

	async canActivate(context: ExecutionContext): Promise<boolean> {
		if (context.getType() === 'rpc') {
			return true
		}

		const permissionCode = this.reflector.getAllAndOverride<string>(
			PERMISSION_CODE,
			[context.getHandler(), context.getClass()]
		)
		if (!permissionCode) return true

		const request: RequestExternal = await context.switchToHttp().getRequest()
		const bearer = request.headers.authorization

		const { message, data, statusCode } = await this.authNatsService.validateToken(bearer, permissionCode)
		if (statusCode !== 200) {
			throw new BusinessException(message as any, HttpStatus.UNAUTHORIZED)
		}

		request.external = request.external || {}
		request.external.user = data
		request.external.userId = data.userId
		request.external.authorized = data.authorized

		return true
	}
}
