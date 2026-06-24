#[derive(Debug, Clone)]
pub enum Expr {
    Number(f64),
    Add(Box<Expr>, Box<Expr>),
    Sub(Box<Expr>, Box<Expr>),
    Mul(Box<Expr>, Box<Expr>),
    Div(Box<Expr>, Box<Expr>),
}

pub fn parse_rpn(expr: &str) -> Result<Expr, String> {
    let mut stack: Vec<Expr> = Vec::new();
    for token in expr.split_whitespace() {
        match token {
            "+" | "-" | "*" | "/" => {
                let right = stack.pop().ok_or("Stack underflow: not enough operands")?;
                let left = stack.pop().ok_or("Stack underflow: not enough operands")?;
                let node = match token {
                    "+" => Expr::Add(Box::new(left), Box::new(right)),
                    "-" => Expr::Sub(Box::new(left), Box::new(right)),
                    "*" => Expr::Mul(Box::new(left), Box::new(right)),
                    "/" => Expr::Div(Box::new(left), Box::new(right)),
                    _ => unreachable!(),
                };
                stack.push(node);
            }
            t => {
                let n: f64 = t
                    .parse()
                    .map_err(|_| format!("Unknown token: '{}'", t))?;
                stack.push(Expr::Number(n));
            }
        }
    }
    stack.pop().ok_or_else(|| "Empty expression".to_string())
}

pub fn evaluate(expr: &Expr) -> f64 {
    match expr {
        Expr::Number(n) => *n,
        Expr::Add(l, r) => evaluate(l) + evaluate(r),
        Expr::Sub(l, r) => evaluate(l) - evaluate(r),
        Expr::Mul(l, r) => evaluate(l) * evaluate(r),
        Expr::Div(l, r) => evaluate(l) / evaluate(r),
    }
}

pub fn pretty_print(expr: &Expr) -> String {
    match expr {
        Expr::Number(n) => {
            if n.fract() == 0.0 {
                format!("{}", *n as i64)
            } else {
                format!("{}", n)
            }
        }
        Expr::Add(l, r) => format!("({} + {})", pretty_print(l), pretty_print(r)),
        Expr::Sub(l, r) => format!("({} - {})", pretty_print(l), pretty_print(r)),
        Expr::Mul(l, r) => format!("({} * {})", pretty_print(l), pretty_print(r)),
        Expr::Div(l, r) => format!("({} / {})", pretty_print(l), pretty_print(r)),
    }
}

fn main() {
    let expr = parse_rpn("3 6 +").unwrap();
    println!("Value: {}", evaluate(&expr));
    println!("Pretty: {}", pretty_print(&expr));

    let nested = parse_rpn("3 6 -6 * +").unwrap();
    println!("Nested value: {}", evaluate(&nested));
    println!("Nested pretty: {}", pretty_print(&nested));
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn single_number() {
        let e = parse_rpn("42").unwrap();
        assert!((evaluate(&e) - 42.0).abs() < 0.001);
    }

    #[test]
    fn simple_addition() {
        let e = parse_rpn("3 6 +").unwrap();
        assert!((evaluate(&e) - 9.0).abs() < 0.001);
    }

    #[test]
    fn nested_expression() {
        let e = parse_rpn("3 6 -6 * +").unwrap();
        assert!((evaluate(&e) - (-33.0)).abs() < 0.001);
    }

    #[test]
    fn pretty_print_addition() {
        let e = parse_rpn("3 6 +").unwrap();
        assert_eq!(pretty_print(&e), "(3 + 6)");
    }

    #[test]
    fn pretty_print_nested() {
        let e = parse_rpn("3 6 2 * +").unwrap();
        assert_eq!(pretty_print(&e), "(3 + (6 * 2))");
    }

    #[test]
    fn unknown_token_returns_error() {
        assert!(parse_rpn("3 x +").is_err());
    }

    #[test]
    fn division() {
        let e = parse_rpn("10 2 /").unwrap();
        assert!((evaluate(&e) - 5.0).abs() < 0.001);
    }
}
