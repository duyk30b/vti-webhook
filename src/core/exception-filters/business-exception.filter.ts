import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common'
import { KafkaContext, NatsContext } from '@nestjs/microservices'
import { Request, Response } from 'express'
import { I18nContext } from 'nestjs-i18n'
import { from } from 'rxjs'
import { I18nPath, I18nTranslations } from 'src/generated/i18n.generated'

export class BusinessException extends Error {
	public statusCode: HttpStatus

	constructor(message: I18nPath, statusCode = HttpStatus.BAD_REQUEST) {
		super(message)
		this.statusCode = statusCode
	}
}

@Catch(BusinessException)
export class BusinessExceptionFilter implements ExceptionFilter {
	catch(exception: BusinessException, host: ArgumentsHost) {
		const [req, res] = host.getArgs()
		const { statusCode } = exception

		const i18n = I18nContext.current<I18nTranslations>(host)
		const message = i18n.translate(exception.message as any)

		if (host.getType() === 'http') {
			const ctx = host.switchToHttp()
			const response = ctx.getResponse<Response>()
			const request = ctx.getRequest<Request>()

			response.status(statusCode).json({
				statusCode,
				message,
				path: request.url,
				timestamp: new Date().toISOString(),
			})
		}
		else if (host.getType() === 'rpc') {
			if (res.constructor.name === 'NatsContext') {
				const response: NatsContext = res

				const info: Record<string, any> = {
					statusCode,
					message,
					details: {
						subject: response.getSubject(),
						request: req,
					},
				}
				return from([info])
			}
			if (res.constructor.name === 'KafkaContext') {
				const response: KafkaContext = res

				const info: Record<string, any> = {
					statusCode,
					message,
					details: {
						topic: response.getTopic(),
						partition: response.getPartition(),
						offset: response.getMessage().offset,
						request: req,
					},
				}
				return from([info])
			}
		}
	}
}
