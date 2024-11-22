import { applyDecorators, Type } from '@nestjs/common'
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger'

interface ApiRouteOptions {
  summary?: string
  responses: Record<number, string | { description?: string; schema?: any }>
  bodyType?: Type<any>
  isBearerAuth?: boolean
}

export const ApiRouteDocumentation = (options: ApiRouteOptions) => {
  const { summary, responses, bodyType, isBearerAuth } = options

  const decorators = [
    ApiOperation({ summary }),
    ...Object.entries(responses).map(([status, description]) => {
      if (typeof description === 'string') {
        return ApiResponse({ status: +status, description })
      } else {
        return ApiResponse({ status: +status, ...description })
      }
    }),
  ]

  if (bodyType) {
    decorators.push(ApiBody({ type: bodyType }))
  }

  if (isBearerAuth) {
    decorators.push(ApiBearerAuth())
  }

  return applyDecorators(...decorators)
}
