import { BeforeAfter as Component, type Props } from './BeforeAfter'
import { OptimizationFriendly } from '@flowbase/framer/components/optimization-friendly'

export { propertyControls } from './property-controls'

export const BeforeAfter: React.FC<Props> = (props) => {
  return (
    <OptimizationFriendly
      loading={
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: `${props.radius}px`,
            background: props.bg,
          }}
        ></div>
      }
      loaded={<Component {...props} />}
    />
  )
}
