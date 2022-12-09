/**
 * 向量归一化。
 * @param { number[] } vector - 向量。
 * @returns { number[] } - 归一化的向量。
 * @example
 * f( [ 2, 2, 2 ] ); // return [ 0.5773502691896258, 0.5773502691896258, 0.5773502691896258 ]
 */
export function normalize ( vector ) {

    const norm = Math.hypot( vector[ 0 ], vector[ 1 ], vector[ 2 ] );

    const x = vector[ 0 ] / norm;
    const y = vector[ 1 ] / norm;
    const z = vector[ 2 ] / norm;

    return [ x, y, z ];

}

/**
 * 计算一个点绕轴旋转后的新坐标，该轴必须过原点。
 * @param { number[] } position - 点的坐标。
 * @param { number[] } vector - 轴（以向量的形式来表示）。
 * @param { number } angle - 旋转的有向角度，以弧度为单位（右手大拇指指向矢量方向，弯曲四指，四指的指向即为旋转的正方向）。
 * @returns { number[] } - 新坐标。
 * @example
 * f( [ 1, 0, 0 ], [ 1, 1, 0 ], - Math.PI ); // return [ - 2.220446049250313e-16, 0.9999999999999998, 8.659560562354932e-17 ]
 */
export function calculatePointRotateAroundAxis( position, vector, angle ) {

    const cos = Math.cos( angle );
    const sin = Math.sin( angle );

    const [ x_v, y_v, z_v ] = normalize( vector );
    const [ x_s, y_s, z_s ] = position;

    const x_t
        = ( x_v * x_v * ( 1 - cos ) + cos ) * x_s
        + ( x_v * y_v * ( 1 - cos ) - z_v * sin ) * y_s
        + ( x_v * z_v * ( 1 - cos ) + y_v * sin ) * z_s;

    const y_t
        = ( y_v * x_v * ( 1 - cos ) + z_v * sin ) * x_s
        + ( y_v * y_v * ( 1 - cos ) + cos ) * y_s
        + ( y_v * z_v * ( 1 - cos ) - x_v * sin ) * z_s;

    const z_t
        = ( x_v * z_v * ( 1 - cos ) - y_v * sin ) * x_s
        + ( y_v * z_v * ( 1 - cos ) + x_v * sin ) * y_s
        + ( z_v * z_v * ( 1 - cos ) + cos ) * z_s;

    return [ x_t, y_t, z_t ];

}
